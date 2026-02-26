import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class ReveillonThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'reveillon';

  @override
  Color get primaryColor => const Color(0xFFFBBF24); // amber-400

  @override
  Color get secondaryColor => const Color(0xFF0F172A); // slate-900

  @override
  Color get surfaceColor => const Color(0xFF1E293B); // slate-800

  @override
  List<Color> get headerGradient => [const Color(0xFFFBBF24), const Color(0xFFFDE68A)];

  @override
  Color titleColor(BuildContext context) {
    return const Color(0xFFFBBF24); // always amber on dark bg
  }

  @override
  Color textColor(BuildContext context) {
    return const Color(0xFF94A3B8); // slate-400
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return const Color(0xFF0F172A); // always dark
  }

  @override
  TextStyle get titleStyle => GoogleFonts.fredoka(fontWeight: FontWeight.w900);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  Widget? buildFloatingComponent(BuildContext context) => null;

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    return BoxDecoration(
      color: const Color(0xFF1E293B).withValues(alpha: 0.9),
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFFFBBF24).withValues(alpha: 0.3)),
      boxShadow: [
        BoxShadow(color: const Color(0xFFFBBF24).withValues(alpha: 0.1), blurRadius: 12, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    return Container(
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment(0, -1),
          radius: 1.5,
          colors: [Color(0xFF1E3A8A), Color(0xFF0F172A), Color(0xFF020617)],
          stops: [0.0, 0.6, 1.0],
        ),
      ),
      child: child,
    );
  }

  @override
  IconData get defaultIcon => LucideIcons.sparkles;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}
