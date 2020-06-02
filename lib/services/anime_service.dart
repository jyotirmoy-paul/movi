import 'dart:convert';
import 'package:html/parser.dart';
import 'package:movi/models/anime_episode_model.dart';
import 'package:movi/models/anime_search_result_model.dart';
import 'package:movi/services/networking.dart';

class AnimeService {
  static const String DESCRIPTION = 'description';
  static const String EPISODES = 'episodes';

  static final _baseUrl = 'https://www.kickassanime.rs';

  static String _queryUrlConstructor(String query) {
    return '$_baseUrl/search?q=$query';
  }

  static String _getRawJson(String responseBody) {
    var document = parse(responseBody);
    var scripts = document.querySelectorAll('script');
    var rawScript = '';
    for (var s in scripts) {
      if (s.text.contains('appData')) {
        rawScript = s.text;
      }
    }
    var rawJson = rawScript.split(' appData = ')[1].split(' || {}')[0];
    return rawJson;
  }

  static Future<List<AnimeSearchResultModel>> searchAnime(String query) async {
    List<AnimeSearchResultModel> l = [];

    var url = _queryUrlConstructor(query);
    var responseBody = await Networking.getStringResponse(url);

    if (responseBody == Networking.ERROR) {
      return l;
    }

    var rawJson = _getRawJson(responseBody);

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

  static Future<Map<String, dynamic>> getAnimeEpisodes(String url) async {
    List<AnimeEpisodeModel> l = [];

    var responseBody = await Networking.getStringResponse(url);

    if (responseBody == Networking.ERROR) {
      return {};
    }

    var rawJson = _getRawJson(responseBody);

    var jsonEpisode = jsonDecode(rawJson)['anime'];

    for (var episode in jsonEpisode['episodes']) {
      l.add(AnimeEpisodeModel(
        episodeNumber: episode['epnum'],
        episodeUrl: _baseUrl + episode['slug'].toString().replaceAll('\\', ''),
        createdDate: episode['createddate'],
      ));
    }

    return {
      DESCRIPTION: jsonEpisode['description'],
      EPISODES: l,
    };
  }
}
