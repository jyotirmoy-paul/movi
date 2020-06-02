import 'package:flutter/material.dart';
import 'package:movi/models/anime_episode_model.dart';
import 'package:movi/models/anime_search_result_model.dart';
import 'package:movi/services/anime_service.dart';
import 'package:movi/utils/constants.dart';

class AnimeEpisodeScreen extends StatefulWidget {
  AnimeEpisodeScreen({
    @required this.anime,
  });

  final AnimeSearchResultModel anime;

  @override
  _AnimeEpisodeScreenState createState() => _AnimeEpisodeScreenState();
}

class _AnimeEpisodeScreenState extends State<AnimeEpisodeScreen> {
  final aspectRatio = 4.5 / 3;
  bool showLoadingIndicator = true;
  List<Widget> widgetList = [];

  void fetchEpisodes(String url) async {
    Map<String, dynamic> m = await AnimeService.getAnimeEpisodes(url);
    if (m.isEmpty) {
      return;
    }

    var description = m[AnimeService.DESCRIPTION];

    widgetList.add(Text('Description', style: kHeadingTextStyle));
    widgetList.add(Text(description, style: kLabelTextStyle));
    widgetList.add(SizedBox(height: 10));
    widgetList.add(Text('Episodes', style: kHeadingTextStyle));

    List<AnimeEpisodeModel> episodes = m[AnimeService.EPISODES];

    for (var episode in episodes) {
      widgetList.add(
        ListTile(
          title: Text(episode.episodeNumber, style: kGeneralTextStyle),
          subtitle: Text(episode.createdDate, style: kLabelTextStyle),
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
    fetchEpisodes(widget.anime.animeUrl);
  }

  @override
  Widget build(BuildContext context) {
    final loadingIndicator = Expanded(
      child: Center(
        child: CircularProgressIndicator(),
      ),
    );

    final expandedListView = Expanded(
      child: ListView(
        padding: EdgeInsets.symmetric(horizontal: 10.0),
        children: widgetList,
      ),
    );

    return Scaffold(
      body: Column(
        children: <Widget>[
          AspectRatio(
            aspectRatio: aspectRatio,
            child: ImageTitleView(widget: widget),
          ),
          showLoadingIndicator ? loadingIndicator : expandedListView,
        ],
      ),
    );
  }
}

class ImageTitleView extends StatelessWidget {
  ImageTitleView({
    @required this.widget,
  });

  final AnimeEpisodeScreen widget;

  final colorFilter = ColorFilter.mode(
    Colors.black.withOpacity(0.6),
    BlendMode.darken,
  );

  final titleTextPadding =
      const EdgeInsets.only(left: 5.0, right: 5.0, bottom: 5.0);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Container(
          decoration: BoxDecoration(
            image: DecorationImage(
              colorFilter: colorFilter,
              fit: BoxFit.fitWidth,
              alignment: FractionalOffset.center,
              image: NetworkImage(widget.anime.posterUrl),
            ),
          ),
        ),
        Align(
          alignment: Alignment.bottomLeft,
          child: Padding(
            padding: titleTextPadding,
            child: Text(
              widget.anime.titleText,
              style: kHeadingTextStyle.copyWith(color: kIvory),
            ),
          ),
        )
      ],
    );
  }
}
