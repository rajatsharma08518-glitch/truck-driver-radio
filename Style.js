document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // YOUTUBE API KEY
    // ==============================

    const API_KEY = "AIzaSyD7YWL-3oqRXoY-Q0W07Vec8_8TNuBTlIQ";


    // ==============================
    // ELEMENTS
    // ==============================

    const form = document.querySelector("form");
    const search = document.querySelector("#search");

    const cards = document.querySelectorAll("#song-card");
    const infos = document.querySelectorAll("#song-info");

    const onlineResults = document.querySelector("#online-results");


    // ==============================
    // FORM RELOAD STOP
    // ==============================

    if (form) {

        form.addEventListener("submit", function (event) {
            event.preventDefault();
        });

    }


    // ==============================
    // SEARCH
    // ==============================

    search.addEventListener("input", function () {

        const text = search.value.toLowerCase().trim();


        // Empty search
        if (text === "") {

            // Show all local songs
            for (let i = 0; i < cards.length; i++) {

                cards[i].style.display = "flex";
                infos[i].style.display = "block";

            }

            // Clear online results
            if (onlineResults) {
                onlineResults.innerHTML = "";
            }

            return;
        }


        // ==============================
        // LOCAL MP4 SONG SEARCH
        // ==============================

        for (let i = 0; i < infos.length; i++) {

            const title = infos[i]
                .querySelector("h3")
                .textContent
                .toLowerCase();

            const singer = infos[i]
                .querySelector("p")
                .textContent
                .toLowerCase();


            if (
                title.includes(text) ||
                singer.includes(text)
            ) {

                cards[i].style.display = "flex";
                infos[i].style.display = "block";

            } else {

                cards[i].style.display = "none";
                infos[i].style.display = "none";

            }

        }


        // ==============================
        // ONLINE YOUTUBE SEARCH
        // ==============================

        searchYouTube(text);

    });


    // ==============================
    // YOUTUBE SEARCH FUNCTION
    // ==============================

    async function searchYouTube(query) {

        if (!onlineResults) {
            return;
        }


        if (API_KEY === "YOUR_API_KEY") {

            onlineResults.innerHTML = `
                <p style="color:white;">
                    YouTube API key add karo.
                </p>
            `;

            return;
        }


        onlineResults.innerHTML = `
            <p style="color:white;">
                Searching for "${query}"...
            </p>
        `;


        const url =
            "https://www.googleapis.com/youtube/v3/search" +
            "?part=snippet" +
            "&q=" + encodeURIComponent(query) +
            "&type=video" +
            "&maxResults=10" +
            "&regionCode=IN" +
            "&relevanceLanguage=hi" +
            "&key=" + API_KEY;


        try {

            const response = await fetch(url);

            const data = await response.json();


            if (!response.ok) {

                console.error(data);

                onlineResults.innerHTML = `
                    <p style="color:red;">
                        YouTube API error.
                    </p>
                `;

                return;
            }


            onlineResults.innerHTML = "";


            if (!data.items || data.items.length === 0) {

                onlineResults.innerHTML = `
                    <p style="color:white;">
                        No online results found.
                    </p>
                `;

                return;
            }


            // ==============================
            // SHOW RESULTS
            // ==============================

            data.items.forEach(function (item) {

                const videoId = item.id.videoId;

                const title = item.snippet.title;

                const channel = item.snippet.channelTitle;

                const thumbnail =
                    item.snippet.thumbnails.medium.url;


                const result = document.createElement("div");

                result.className = "online-song";


                result.innerHTML = `

                    <img
                        src="${thumbnail}"
                        alt="Song thumbnail"
                    >

                    <div class="online-song-info">

                        <h3>${title}</h3>

                        <p>${channel}</p>

                        <button
                            class="youtube-button"
                            data-video="${videoId}">
                            ▶ Play on YouTube
                        </button>

                    </div>

                `;


                onlineResults.appendChild(result);

            });


            // ==============================
            // PLAY BUTTON
            // ==============================

            const buttons =
                onlineResults.querySelectorAll(".youtube-button");


            buttons.forEach(function (button) {

                button.addEventListener("click", function () {

                    const videoId =
                        button.getAttribute("data-video");


                    window.open(
                        "https://www.youtube.com/watch?v=" + videoId,
                        "_blank"
                    );

                });

            });


        } catch (error) {

            console.error(error);

            onlineResults.innerHTML = `
                <p style="color:red;">
                    Internet connection/API error.
                </p>
            `;

        }

    }

});