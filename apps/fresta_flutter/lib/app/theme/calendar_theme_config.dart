import 'package:flutter/material.dart';

/// Visual configuration for locked day modal per theme.
class LockedModalThemeStyle {
  final Color buttonColor;
  final Color iconColor;
  final Color bgColor;
  final Color borderColor;
  final Color textColor;
  final Gradient? buttonGradient;
  final IconData icon;
  final String title;
  final String message;

  const LockedModalThemeStyle({
    required this.buttonColor,
    required this.iconColor,
    required this.bgColor,
    required this.borderColor,
    required this.textColor,
    this.buttonGradient,
    this.icon = Icons.lock_outline,
    this.title = 'Ainda não é hora...',
    this.message = 'Essa surpresa está guardada pra o dia certo.',
  });
}

/// Visual configuration for universal card states per theme.
class CardStateStyle {
  // Envelope card (day with text/link — sealed)
  final Color envelopeBg;
  final Color envelopeBorder;
  final Color envelopeSealStart;
  final Color envelopeSealEnd;
  final Color envelopeButtonBg;
  final Color envelopeButtonText;
  final Gradient? envelopeButtonGradient;

  // Locked card (future day)
  final Color lockedBg;
  final Color lockedBorder;
  final Color lockedNumberColor;

  // Unlocked card (opened/available with media)
  final Color unlockedBorder;
  final Color unlockedBadgeBg;

  // Glow shadow
  final Color glowColor;

  const CardStateStyle({
    this.envelopeBg = const Color(0xFFFDF2F8),
    this.envelopeBorder = const Color(0x33E11D48),
    this.envelopeSealStart = const Color(0xFFF43F5E),
    this.envelopeSealEnd = const Color(0xFFBE123C),
    this.envelopeButtonBg = const Color(0xFFE11D48),
    this.envelopeButtonText = Colors.white,
    this.envelopeButtonGradient,
    this.lockedBg = const Color(0xFFF5F5F5),
    this.lockedBorder = const Color(0xFFE5E7EB),
    this.lockedNumberColor = const Color(0xFF9CA3AF),
    this.unlockedBorder = const Color(0xFFE5E7EB),
    this.unlockedBadgeBg = const Color(0xFFE11D48),
    this.glowColor = const Color(0x4DE11D48),
  });
}

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

  // Default Messages
  String get defaultHeaderMessage => 'Prepare-se para uma surpresa!';
  String get defaultFooterMessage => 'Muito obrigado por fazer parte desta história!';

  // Icons and visual flags
  IconData get defaultIcon;
  IconData get lockedIcon;

  // --- Card States Styling (ported from web UniversalTemplate) ---
  CardStateStyle get cardStateStyle => const CardStateStyle();

  // --- Locked Modal Styling (ported from web LockedModal) ---
  LockedModalThemeStyle get lockedModalStyle => LockedModalThemeStyle(
    buttonColor: primaryColor,
    iconColor: primaryColor,
    bgColor: surfaceColor,
    borderColor: primaryColor.withValues(alpha: 0.2),
    textColor: primaryColor,
  );

  // --- Whether this theme uses a dark background ---
  bool get isDarkTheme => false;
}
