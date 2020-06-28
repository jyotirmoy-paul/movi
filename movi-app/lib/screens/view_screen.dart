import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:movi/services/anime_service.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ViewScreen extends StatefulWidget {
  ViewScreen({
    @required this.url,
  });

  final url;

  @override
  _ViewScreenState createState() => _ViewScreenState();
}

class _ViewScreenState extends State<ViewScreen> {
  final Completer<WebViewController> _controller =
      Completer<WebViewController>();

  bool showLoadingIndicator = true;
  String videoUrl = '';

  // try fixing the webview and allow a more powerful user experience, allow user to choose server

  void fetchPlayUrl() async {
    videoUrl = await AnimeService.getVideoUrl(widget.url);
    setState(() {
      showLoadingIndicator = false;
    });
  }

  @override
  void initState() {
    super.initState();
    fetchPlayUrl();
  }

  @override
  void didChangeDependencies() {
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeRight,
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    final loadingIndicator = Center(
      child: CircularProgressIndicator(),
    );

    final webView = WebView(
      initialUrl: videoUrl,
      javascriptMode: JavascriptMode.unrestricted,
      onWebViewCreated: (WebViewController webViewController) {
        _controller.complete(webViewController);
      },
      gestureNavigationEnabled: false,
    );

    return Scaffold(
      body: showLoadingIndicator ? loadingIndicator : webView,
    );
  }
}
