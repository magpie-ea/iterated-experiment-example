// when the DOM is created and JavaScript code can run safely,
// the experiment initialisation is called
$("document").ready(function() {
    // prevent scrolling when space is pressed
    window.onkeydown = function(e) {
        if (e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
        }
    };

    babeInit({
        // views_seq: [init, intro, instructions, lobby, game, thanks],
        views_seq: [init, intro, instructions, lobby, game, thanks],
        deploy: {
            experimentID: "12",
            // serverAppURL:
            //     "https://babe-demo.herokuapp.com/api/submit_experiment/",
            serverAppURL: "http://localhost:4000/api/submit_experiment/",
            // socketURL: "wss://babe-demo.herokuapp.com/socket",
            // WTF why is localhost no longer working??? No fucking idea.
            socketURL: "ws://localhost:4000/socket",
            deployMethod: "debug",
            contact_email: "YOUREMAIL@wherelifeisgreat.you",
            prolificURL:
                "https://app.prolific.ac/submissions/complete?cc=EXAMPLE1234",
            numParticipantsPerExp: 2
        },
        progress_bar: {
            in: ["forcedChoice"],
            style: "default",
            width: 100
        }
    });
});