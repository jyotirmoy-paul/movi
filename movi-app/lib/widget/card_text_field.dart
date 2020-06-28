import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:movi/utils/constants.dart';

class CardTextField extends StatelessWidget {
  CardTextField({
    this.searchController,
    this.onPressed,
  });

  final TextEditingController searchController;
  final Function onPressed;

  final labelText = 'Search for Anime';
  final cardElevation = 10.0;
  final cardShape = const RoundedRectangleBorder(
    borderRadius: BorderRadius.all(Radius.circular(10)),
    side: BorderSide(
      color: kGreenRYB,
    ),
  );
  final cardMargin = const EdgeInsets.all(10.0);
  final cardChildPadding = const EdgeInsets.symmetric(horizontal: 10.0);
  final icon = Icon(
    FontAwesomeIcons.search,
    color: kDarkLava,
  );

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: cardMargin,
      elevation: cardElevation,
      shadowColor: kGreenRYB,
      shape: cardShape,
      child: Padding(
        padding: cardChildPadding,
        child: TextField(
          controller: searchController,
          decoration: InputDecoration(
            suffixIcon: IconButton(
              icon: icon,
              onPressed: onPressed,
            ),
            border: InputBorder.none,
            labelText: labelText,
            labelStyle: kLabelTextStyle,
          ),
          style: kGeneralTextStyle,
        ),
      ),
    );
  }
}
