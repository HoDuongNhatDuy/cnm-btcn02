$(window).on('load', function () {
    let access_token = window.location.hash;
    if (access_token.length > 0) {
        if (access_token.indexOf("#access_token=") > -1) {
            access_token = access_token.replace("#access_token=", "");
            localStorage.instagram_token = access_token;
            window.location.replace("/");
        }
    }

    if (typeof localStorage.instagram_token == 'undefined') {
        let url = 'https://api.instagram.com/oauth/authorize/?client_id=' + INSTAGRAM_API_CLIENT_ID + '&redirect_uri=' + INSTAGRAM_REDIRECT_URI + '&response_type=token&scope=basic+public_content';
        window.location.replace(url);
    }
});

function gg_api_get_geocode_data(address, callback) {
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + GG_API_KEY;

    $.get(url, function (response) {
        callback(response.results);

    });
}

function instagram_api_search_location(lat, lng, callback) {
    let url = 'https://api.instagram.com/v1/locations/search?lat=' + lat + '&lng=' + lng + '&access_token=' + localStorage.instagram_token;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        success: function (response) {
            callback(response);
        }
    })
}

function instagram_api_get_location_media(location_id, callback) {
    $.get(`/get-instagram-location-media/?location_id=${location_id}`, function (response) {
        // console.log(response);

        let res = response.location.media.nodes;
        callback(res);

    });
}


function loader(state = false, element = 'body') {
    let loader_html = '<div class="loader"> <div class="pre-loader"></div></div>';
    if (state) {
        $('.loader').remove();
        if ($(element).length) {
            $(element).append(loader_html);
        }
    }
    else {
        $('.loader').remove();
    }
}

function show_location_loader() {
    loader(true, '#location-content');
}

function hide_loader() {
    loader(false);
}

function show_media_loader() {
    loader(true, '#media-content');
}

function render_single_location(location) {
    if (location.id < 1)
        return "";

    let html = `
            <li id="location-${location.id}" style="display: none;" class="location-item" data-location-id="${location.id}">
                <p class="title">${location.name}</p>
                <p>Lng: <span>${location.longitude}</span></p>
                <p>Lat: <span>${location.latitude}</span></p>
            </li>
        `;

    return html;
}

function update_location_list(address) {
    show_location_loader();
    $('#location-content ul li').fadeOut();
    $('#location-content ul').html('');

    gg_api_get_geocode_data(address, function (gg_response) {
        gg_response.forEach(function (gg_item) {
            let lng = gg_item.geometry.location.lng;
            let lat = gg_item.geometry.location.lat;

            instagram_api_search_location(lat, lng, function (inst_response) {
                inst_response.data.forEach(function (inst_item) {
                    let location_id = inst_item.id;

                    let html = render_single_location(inst_item);
                    $('#location-content ul').append(html);
                    $('#location-' + location_id).fadeIn();
                    hide_loader();
                });
            });
        })
    });
}

$('#search-form').submit(function (e) {
    e.preventDefault();

    let address = $('#search-address').val();
    update_location_list(address);
});

function render_single_media(media) {
    console.log(media);
    let html = `
        <li> 
            <a target="_blank" href="https://www.instagram.com/p/${media.code}/?explore=true">
                <div style="display: none; background-image: url('${media.display_src}')" title="${media.caption}" id="media-${media.id}" class="media-item">
                </div>
            </a>
        </li>
    `;
    return html;
}

function update_media_list(location_id) {
    show_media_loader();
    $('#media-content ul li').fadeOut();
    $('#media-content ul').html('');

    instagram_api_get_location_media(location_id, function (inst_response) {
        inst_response.forEach(function (media_item) {
            let media_id = media_item.id;
            let html = render_single_media(media_item);
            $('#media-content ul').append(html);
            $('#media-' + media_id).fadeIn();
            hide_loader();
        });
    });
}

$('body').on('click', '.location-item', function () {
    let location_id = $(this).data('location-id');
    update_media_list(location_id);
});