import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class SaojoaoThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'saojoao';

  @override
  Color get primaryColor => const Color(0xFFE65100); // deep orange

  @override
  Color get secondaryColor => const Color(0xFF5D4037); // brown-800

  @override
  Color get surfaceColor => const Color(0xFFFFF8E8); // warm cream

  @override
  List<Color> get headerGradient => [const Color(0xFFE65100), const Color(0xFFFF8F00)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF5D4037);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF8D6E63);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFFFF8E8);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.fredoka(fontWeight: FontWeight.w700);

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
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : const Color(0xFFFFF8E1),
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFFFFB74D).withValues(alpha: 0.5)),
      boxShadow: [
        BoxShadow(color: const Color(0xFFE65100).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
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
  IconData get defaultIcon => LucideIcons.flame;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}
