const iteratedExperimentViews = {
    init: function(config) {
        const _init = {
            name: config.name,
            title: config.title,
            text: config.text || "Initializing the experiment...",
            render: function(CT, babe) {
                const viewTemplate = `
                        <div className="babe-view">
                            <h1 className="babe-view-title">${this.title}</h1>
                            <section className="babe-text-container">
                                <p id="lobby-text" className="babe-view-text">${
                                    this.text
                                }</p>
                            </section>
                        </div>
                `;

                $("#main").html(viewTemplate);

                // Hopefully by telling them upfront they will stop the HIT before ever taking it.
                babe.onSocketError = function(reasons) {
                    window.alert(
                        `Sorry, a connection to our server couldn't be established. You may want to wait and try again. If the error persists, do not proceed with the HIT. Thank you for your understanding. Error: ${reasons}`
                    );
                };

                babe.onSocketTimeout = function() {
                    window.alert(
                        `Sorry, the connection to our server timed out. You may want to wait and try again. If the error persists, do not proceed with the HIT. Thank you for your understanding. `
                    );
                };

                // Generate a unique ID for each participant.
                babe.participant_id = iteratedExperimentUtils.generateId(40);

                // Create a new socket
                // Documentation at: https://hexdocs.pm/phoenix/js/
                babe.socket = new Phoenix.Socket(babe.deploy.socketURL, {
                    params: {
                        participant_id: babe.participant_id,
                        experiment_id: babe.deploy.experimentID
                    }
                });

                // Set up what to do when the whole socket connection crashes/fails.
                babe.socket.onError(() =>
                    babe.onSocketError(
                        "The connection to the server was dropped."
                    )
                );

                // Not really useful. This will only be invoked when the connection is explicitly closed by either the server or the client.
                // babe.socket.onClose( () => console.log("Connection closed"));

                // Try to connect to the server.
                babe.socket.connect();

                // First join the participant channel belonging only to this participant.
                babe.participantChannel = babe.socket.channel(
                    `participant:${babe.participant_id}`,
                    {}
                );

                babe.participantChannel.on(
                    "experiment_available",
                    (payload) => {
                        // First record the assigned <variant-nr, chain-nr, realization-nr> tuple.
                        babe.variant = payload.variant;
                        babe.chain = payload.chain;
                        babe.realization = payload.realization;
                        // Proceed to the next view if the connection to the participant channel was successfully established.
                        babe.findNextView();
                    }
                );

                babe.participantChannel
                    .join()
                    // Note that `receive` functions are for receiving a *reply* from the server after you try to send it something, e.g. `join()` or `push()`.
                    // While `on` function is for passively listening for new messages initiated by the server.
                    .receive("ok", (payload) => {
                        // We still need to wait for the actual confirmation message of "experiment_available". So we do nothing here.
                    })
                    .receive("error", (reasons) => {
                        babe.onSocketError(reasons);
                    })
                    .receive("timeout", () => {
                        babe.onSocketTimeout();
                    });
            },
            CT: 0,
            trials: config.trials
        };
        return _init;
    },
    iteratedExperimentLobby: function(config) {
        const _lobby = {
            name: config.name,
            title: config.title,
            text: config.text || "Connecting to the server...",
            render: function(CT, babe) {
                const viewTemplate = `
                    <div className="babe-view">
                        <h1 className="babe-view-title">${this.title}</h1>
                        <section className="babe-text-container">
                            <p id="lobby-text" className="babe-view-text">${
                                this.text
                            }</p>
                        </section>
                    </div>
                `;

                $("#main").html(viewTemplate);

                // If this participant is one of the first generation, there should be no need to wait on any results.
                if (babe.realization == 1) {
                    console.log("Not waiting in the lobby");
                    // Apparently you can't call babe.findNextView too soon, otherwise it will just try to render the same view over and over again.
                    setTimeout(babe.findNextView, 1000);
                } else {
                    console.log("Waiting in the lobby");
                    babe.lobbyChannel = babe.socket.channel(
                        `iterated_lobby:${babe.variant}:${babe.chain}:${
                            babe.realization
                        }`,
                        { participant_id: babe.participant_id }
                    );

                    // Whenever the waited-on results are submitted (i.e. assignment finished) on the server, this participant will get the results.
                    babe.lobbyChannel.on("finished", (payload) => {
                        babe.results = payload.results;
                        babe.findNextView();
                    });

                    // Check whether the interactive experiment can be started.
                    babe.lobbyChannel
                        .join()
                        .receive("ok", (msg) => {
                            document.getElementById("lobby-text").innerHTML =
                                "<p>Successfully joined the lobby. Waiting for the server...</p>";
                        })
                        .receive("error", (reasons) => {
                            babe.onSocketError(reasons);
                        })
                        .receive("timeout", () => {
                            babe.onSocketTimeout();
                        });
                }
            },
            CT: 0,
            trials: config.trials
        };

        return _lobby;
    }
};
