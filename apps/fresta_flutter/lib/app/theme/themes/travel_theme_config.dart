import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class TravelThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'viagem';

  @override
  Color get primaryColor => const Color(0xFF0EA5E9); // sky-500
  
  @override
  Color get secondaryColor => const Color(0xFFF59E0B); // amber-500
  
  @override
  Color get surfaceColor => const Color(0xFFF0F9FF); // sky-50

  @override
  List<Color> get headerGradient => [const Color(0xFF38BDF8), const Color(0xFF0284C7)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF0369A1); // sky-700
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF075985).withValues(alpha: 0.8);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).scaffoldBackgroundColor 
        : const Color(0xFFF0F9FF);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.outfit(
        fontWeight: FontWeight.w800,
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
      border: Border.all(color: const Color(0xFF0EA5E9).withValues(alpha: 0.3), width: 2),
      boxShadow: [
        BoxShadow(
          color: const Color(0xFF0EA5E9).withValues(alpha: 0.08),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    return Container(color: scaffoldBackgroundColor(context), child: child);
  }

  @override
  IconData get defaultIcon => LucideIcons.plane;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}
