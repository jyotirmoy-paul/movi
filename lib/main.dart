import 'package:flutter/material.dart';
import 'package:movi/screens/search_screen.dart';
import 'package:movi/utils/constants.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Movi',
      theme: ThemeData(
        primaryColor: kDarkLava,
        accentColor: kGreenRYB,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: SearchScreen(),
    );
  }
}
