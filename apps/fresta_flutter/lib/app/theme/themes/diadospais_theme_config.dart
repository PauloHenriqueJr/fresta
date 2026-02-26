import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class DiadospaisThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'diadospais';

  @override
  Color get primaryColor => const Color(0xFF475569); // slate-600

  @override
  Color get secondaryColor => const Color(0xFF2563EB); // blue-600

  @override
  Color get surfaceColor => const Color(0xFFF1F5F9); // slate-100

  @override
  List<Color> get headerGradient => [const Color(0xFF475569), const Color(0xFF2563EB)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF334155); // slate-700
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF64748B); // slate-500
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFF1F5F9);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.playfairDisplay(fontWeight: FontWeight.w800);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  Widget? buildFloatingComponent(BuildContext context) => null;

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFF475569).withValues(alpha: 0.15)),
      boxShadow: [
        BoxShadow(color: const Color(0xFF475569).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
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
  IconData get defaultIcon => LucideIcons.crown;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}
