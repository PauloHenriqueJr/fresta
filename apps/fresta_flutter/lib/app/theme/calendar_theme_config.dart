import 'package:flutter/material.dart';

abstract class CalendarThemeConfig {
  String get id;

  // Colors
  Color get primaryColor;
  Color get secondaryColor;
  Color get surfaceColor;
  List<Color> get headerGradient;
  Color titleColor(BuildContext context);
  Color textColor(BuildContext context);

  // Background
  Color scaffoldBackgroundColor(BuildContext context);

  // Typography
  TextStyle get titleStyle;
  TextStyle get bodyStyle;

  // Additional Components
  Widget? buildFloatingComponent(BuildContext context) => null;
  Widget? buildHeaderComponent(BuildContext context) => null;
  
  BoxDecoration cardDecoration(BuildContext context);
  Widget buildBackground(BuildContext context, Widget child);

  // Icons and visual flags
  IconData get defaultIcon;
  IconData get lockedIcon;
}
