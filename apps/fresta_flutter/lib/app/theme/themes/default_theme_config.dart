import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class DefaultThemeConfig extends CalendarThemeConfig {
  @override
  String get id => 'default';

  @override
  Color get primaryColor => const Color(0xFF2D7A5F);
  
  @override
  Color get secondaryColor => const Color(0xFFF9A03F);
  
  @override
  Color get surfaceColor => Colors.white;

  @override
  List<Color> get headerGradient => [const Color(0xFFD1FAE5), const Color(0xFF2D7A5F)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF1B4D3E);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF5A7470);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).scaffoldBackgroundColor;
  }

  @override
  TextStyle get titleStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, letterSpacing: -0.5);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Prepare-se para uma surpresa especial';

  @override
  String get defaultFooterMessage => 'Muito obrigado por fazer parte desta história!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => null;

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: Theme.of(context).colorScheme.surface,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1)),
      boxShadow: [
        BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05), blurRadius: 10, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    return Container(
      color: scaffoldBackgroundColor(context),
      child: child,
    );
  }

  @override
  IconData get defaultIcon => LucideIcons.calendar;

  @override
  IconData get lockedIcon => LucideIcons.lock;

  @override
  CardStateStyle get cardStateStyle => const CardStateStyle(
    envelopeBg: Color(0xFFF0FDF4),
    envelopeBorder: Color(0x332D7A5F),
    envelopeSealStart: Color(0xFF2D7A5F),
    envelopeSealEnd: Color(0xFFF9A03F),
    envelopeButtonBg: Color(0xFF2D7A5F),
    envelopeButtonText: Colors.white,
    lockedBg: Color(0xFFF5F5F5),
    lockedBorder: Color(0xFFE5E7EB),
    lockedNumberColor: Color(0xFF9CA3AF),
    unlockedBorder: Color(0xFFE5E7EB),
    unlockedBadgeBg: Color(0xFF2D7A5F),
    glowColor: Color(0x332D7A5F),
  );
}
