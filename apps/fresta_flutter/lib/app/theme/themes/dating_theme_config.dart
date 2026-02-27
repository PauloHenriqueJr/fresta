import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';
import '../dating_theme.dart';

class DatingThemeConfig extends CalendarThemeConfig {
  @override
  String get id => 'namoro';

  @override
  Color get primaryColor => DatingTheme.loveRed;
  
  @override
  Color get secondaryColor => DatingTheme.wineBerry;
  
  @override
  Color get surfaceColor => DatingTheme.romancePink;

  @override
  List<Color> get headerGradient => DatingTheme.blushGradient;

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : DatingTheme.wineBerry;
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : DatingTheme.wineBerry.withValues(alpha: 0.8);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).scaffoldBackgroundColor 
        : DatingTheme.romancePink;
  }

  @override
  TextStyle get titleStyle => DatingTheme.display;

  @override
  TextStyle get bodyStyle => DatingTheme.body;

  @override
  String get defaultHeaderMessage => 'Uma jornada de amor para nós dois';

  @override
  String get defaultFooterMessage => 'Com todo o meu amor, para sempre.';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const FloatingHearts();

  @override
  Widget? buildHeaderComponent(BuildContext context) => const HangingHeartsHeader();

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surface : Colors.white,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: DatingTheme.loveRed.withValues(alpha: 0.2), width: 2),
      boxShadow: [
        BoxShadow(
          color: DatingTheme.loveRed.withValues(alpha: 0.05),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) {
      return Container(
        color: Theme.of(context).scaffoldBackgroundColor,
        child: child,
      );
    }
    return DatingBackground(child: child);
  }

  @override
  IconData get defaultIcon => Icons.favorite_rounded;

  @override
  IconData get lockedIcon => LucideIcons.lock;

  @override
  CardStateStyle get cardStateStyle => const CardStateStyle(
    envelopeBg: Color(0xFFFDF2F8),
    envelopeBorder: Color(0x33E11D48),
    envelopeSealStart: Color(0xFFF43F5E),
    envelopeSealEnd: Color(0xFFBE123C),
    envelopeButtonBg: Color(0xFFE11D48),
    envelopeButtonText: Colors.white,
    lockedBg: Color(0xFFFFE4E6),
    lockedBorder: Color(0xFFFECDD3),
    lockedNumberColor: Color(0xFFFDA4AF),
    unlockedBorder: Color(0xFFFECDD3),
    unlockedBadgeBg: Color(0xFFE11D48),
    glowColor: Color(0x4DE11D48),
  );

  @override
  LockedModalThemeStyle get lockedModalStyle => const LockedModalThemeStyle(
    buttonColor: Color(0xFFE11D48),
    iconColor: Color(0xFFF43F5E),
    bgColor: Color(0xFFFDF2F8),
    borderColor: Color(0x33E11D48),
    textColor: Color(0xFFBE123C),
    icon: Icons.favorite_outline,
    title: 'Ainda não é hora...',
    message: 'Essa surpresa está guardada com carinho pra o dia certo.',
  );
}
