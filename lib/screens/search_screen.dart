import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:movi/screens/search_result_screen.dart';
import 'package:movi/utils/constants.dart';
import 'package:movi/widget/card_text_field.dart';

class SearchScreen extends StatefulWidget {
  @override
  _SearchScreenState createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _controller = TextEditingController();

  void navigate() {
    String searchedTerm = _controller.text.trim();

    final pageRoute = MaterialPageRoute(
      builder: (ctx) => SearchResultScreen(
        searchedTerm: searchedTerm,
      ),
    );

    Navigator.push(context, pageRoute);
  }

  void requestFocus() => Focus.of(context).requestFocus(FocusNode());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kIvory,
      body: GestureDetector(
        onTap: requestFocus,
        child: SafeArea(
          child: Align(
            alignment: Alignment.bottomCenter,
            child: CardTextField(
              searchController: _controller,
              onPressed: navigate,
            ),
          ),
        ),
      ),
    );
  }
}
