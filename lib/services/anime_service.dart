import 'dart:convert';
import 'package:html/parser.dart';
import 'package:movi/models/anime_search_result_model.dart';
import 'package:movi/services/networking.dart';

class AnimeService {
  static final _baseUrl = 'https://www.kickassanime.rs';

  static String _queryUrlConstructor(String query) {
    return '$_baseUrl/search?q=$query';
  }

  static Future<List<AnimeSearchResultModel>> searchAnime(String query) async {
    List<AnimeSearchResultModel> l = [];

    var url = _queryUrlConstructor(query);
    var responseBody = await Networking.getStringResponse(url);

    if (responseBody == Networking.ERROR) {
      return l;
    }

    var document = parse(responseBody);
    var scripts = document.querySelectorAll('script');
    var rawScript = '';
    for (var s in scripts) {
      if (s.text.contains('appData')) {
        // script contains the animeList
        rawScript = s.text;
      }
    }

    var rawJson = rawScript.split(' appData = ')[1].split(' || {}')[0];
    var jsonAnimeList = jsonDecode(rawJson)['animes'];

    for (var anime in jsonAnimeList) {
      l.add(AnimeSearchResultModel(
        animeUrl: _baseUrl + anime['slug'].toString().replaceAll('\\', ''),
        posterUrl:
            anime['image'].toString().replaceAll('\\', '') + anime['poster'],
        titleText: anime['name'],
      ));
    }

    return l;
  }
}
