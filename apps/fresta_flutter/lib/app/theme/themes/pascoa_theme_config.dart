import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class PascoaThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'pascoa';

  @override
  Color get primaryColor => const Color(0xFFC084FC); // purple-400

  @override
  Color get secondaryColor => const Color(0xFFF472B6); // pink-400

  @override
  Color get surfaceColor => const Color(0xFFFDF4FF); // fuchsia-50

  @override
  List<Color> get headerGradient => [const Color(0xFFC084FC), const Color(0xFFF472B6)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF9333EA); // purple-600
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFFA855F7); // purple-400
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFFDF4FF);
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
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white.withValues(alpha: 0.7),
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: const Color(0xFFC084FC).withValues(alpha: 0.3)),
      boxShadow: [
        BoxShadow(color: const Color(0xFFC084FC).withValues(alpha: 0.1), blurRadius: 12, offset: const Offset(0, 4)),
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
  IconData get defaultIcon => LucideIcons.egg;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}
