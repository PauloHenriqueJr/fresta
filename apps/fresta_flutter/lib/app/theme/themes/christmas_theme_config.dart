import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class ChristmasThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'natal';

  @override
  Color get primaryColor => const Color(0xFFDC2626); // red-600
  
  @override
  Color get secondaryColor => const Color(0xFF16A34A); // green-600
  
  @override
  Color get surfaceColor => const Color(0xFFFDF5E6); // eggshell/warm white

  @override
  List<Color> get headerGradient => [const Color(0xFFDC2626), const Color(0xFFB91C1C)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFFB91C1C); // red-700
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF15803D); // green-700
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).scaffoldBackgroundColor 
        : const Color(0xFFFDF5E6);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.kalam( // Using kalam as festive font
        fontWeight: FontWeight.w900, // black
      );

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  Widget? buildFloatingComponent(BuildContext context) => null;

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFFDC2626).withValues(alpha: 0.5), width: 3), // red-600 border
      boxShadow: [
        BoxShadow(
          color: const Color(0xFFDC2626).withValues(alpha: 0.1),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    return Container(
      decoration: BoxDecoration(color: scaffoldBackgroundColor(context)),
      child: child,
    );
  }

  @override
  IconData get defaultIcon => LucideIcons.gift;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}
