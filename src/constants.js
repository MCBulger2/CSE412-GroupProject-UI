let _baseUrl = "https://cse412.mattbulger.me:5000";
if (window.location.hostname === "localhost") {
    _baseUrl = "http://192.168.1.19:5000"
}

export const baseUrl = _baseUrl;