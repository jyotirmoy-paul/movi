import 'package:http/http.dart' as http;

class Networking {
  static const String ERROR = 'error';
  static Map<String, String> _header = {
    'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
  };

  static Future<String> getStringResponse(String url) async {
    http.Response r = await http.get(url, headers: _header);
    if (r.statusCode == 200) {
      return r.body;
    }
    return ERROR;
  }
}
