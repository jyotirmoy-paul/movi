import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:movi/models/anime_search_result_model.dart';
import 'package:movi/screens/anime_episode_screen.dart';
import 'package:movi/services/anime_service.dart';
import 'package:movi/utils/constants.dart';

class SearchResultScreen extends StatefulWidget {
  const SearchResultScreen({
    @required this.searchedTerm,
  });

  final String searchedTerm;

  @override
  _SearchResultScreenState createState() => _SearchResultScreenState();
}

class _SearchResultScreenState extends State<SearchResultScreen> {
  bool showLoadingIndicator = true;
  List<Widget> widgetList = [];

  void showEpisodes(AnimeSearchResultModel anime) {
    var pageRoute = MaterialPageRoute(
      builder: (ctx) => AnimeEpisodeScreen(
        anime: anime,
      ),
    );
    Navigator.push(context, pageRoute);
  }

  void fetchSearchedAnime(String searchTerm) async {
    List<AnimeSearchResultModel> l = await AnimeService.searchAnime(searchTerm);

    for (var anime in l) {
      widgetList.add(
        ListTile(
          onTap: () => showEpisodes(anime),
          title:
              Hero(tag: anime.animeUrl, child: Image.network(anime.posterUrl)),
          subtitle: Text(
            anime.titleText,
            style: kGeneralTextStyle,
          ),
        ),
      );
    }

    setState(() {
      showLoadingIndicator = false;
    });
  }

  @override
  void initState() {
    super.initState();
    fetchSearchedAnime(widget.searchedTerm);
  }

  void requestFocus() => Focus.of(context).requestFocus(FocusNode());

  @override
  Widget build(BuildContext context) {
    final headingTextWidget = Text(
      widget.searchedTerm,
      style: kHeadingTextStyle,
      textAlign: TextAlign.center,
    );

    final columnPadding = const EdgeInsets.only(top: 10);
    final listViewPadding = const EdgeInsets.symmetric(horizontal: 10.0);

    final loadingIndicator = Expanded(
      child: Center(
        child: CircularProgressIndicator(),
      ),
    );

    final expandedListView = Expanded(
      child: ListView(
        padding: listViewPadding,
        children: widgetList,
      ),
    );

    return Scaffold(
      body: SafeArea(
        child: GestureDetector(
          onTap: requestFocus,
          child: Padding(
            padding: columnPadding,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                headingTextWidget,
                showLoadingIndicator ? loadingIndicator : expandedListView,
              ],
            ),
          ),
        ),
      ),
    );
  }
}
