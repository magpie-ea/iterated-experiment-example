// when the DOM is created and JavaScript code can run safely,
// the experiment initialisation is called
$('document').ready(function () {
    // prevent scrolling when space is pressed
    window.onkeydown = function (e) {
        if (e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
        }
    };

    babeInit({
        // views_seq: [init, intro, instructions, lobby, game, thanks],
        views_seq: [init, intro, instructions, lobby, trial, thanks],
        deploy: {
            experimentID: '39efa875-2224-4956-a22c-f75280b40964',
            // experimentID: "1",
            serverAppURL:
                'https://magpie-backend.gigalixirapp.com/api/submit_experiment/',
            // serverAppURL: 'http://localhost:4000/api/submit_experiment/',
            socketURL: 'wss://magpie-backend.gigalixirapp.com/socket',
            // socketURL: 'ws://localhost:4000/socket',
            deployMethod: 'directLink',
            contact_email: 'YOUREMAIL@wherelifeisgreat.you',
            prolificURL:
                'https://app.prolific.ac/submissions/complete?cc=EXAMPLE1234'
        },
        progress_bar: {
            in: ['forcedChoice'],
            style: 'default',
            width: 100
        }
    });
});
