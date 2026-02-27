import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

/// Bodas (Wedding Anniversary) — Elegant burgundy/wine theme
class BodasThemeConfig extends CalendarThemeConfig {
  @override
  String get id => 'bodas';

  @override
  Color get primaryColor => const Color(0xFF9F1239);

  @override
  Color get secondaryColor => const Color(0xFFBE185D);

  @override
  Color get surfaceColor => const Color(0xFFFFF1F2);

  @override
  List<Color> get headerGradient => [const Color(0xFF9F1239), const Color(0xFFBE185D)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF9F1239);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFFBE185D);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFFFF1F2);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold, fontStyle: FontStyle.italic);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Celebrando mais um ano de amor e cumplicidade';

  @override
  String get defaultFooterMessage => 'Que venham muitos outros anos de felicidade!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _BodasSparkles();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white,
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: const Color(0xFF9F1239).withValues(alpha: 0.2)),
      boxShadow: [BoxShadow(color: const Color(0xFF9F1239).withValues(alpha: 0.06), blurRadius: 10, offset: const Offset(0, 4))],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return Stack(children: [
      Positioned.fill(child: Container(color: const Color(0xFFFFF1F2))),
      Positioned.fill(child: CustomPaint(painter: _BodasPatternPainter())),
      child,
    ]);
  }

  @override
  IconData get defaultIcon => LucideIcons.wine;
  @override
  IconData get lockedIcon => LucideIcons.lock;

  @override
  CardStateStyle get cardStateStyle => const CardStateStyle(
    envelopeBg: Color(0xFFFFF1F2),
    envelopeBorder: Color(0x339F1239),
    envelopeSealStart: Color(0xFF9F1239),
    envelopeSealEnd: Color(0xFFBE185D),
    envelopeButtonBg: Color(0xFF9F1239),
    envelopeButtonText: Colors.white,
    lockedBg: Color(0xFFFFF1F2),
    lockedBorder: Color(0xFFFFE4E6),
    lockedNumberColor: Color(0xFFFDA4AF),
    unlockedBorder: Color(0xFFFFE4E6),
    unlockedBadgeBg: Color(0xFF9F1239),
    glowColor: Color(0x4D9F1239),
  );

  @override
  LockedModalThemeStyle get lockedModalStyle => const LockedModalThemeStyle(
    buttonColor: Color(0xFF9F1239),
    iconColor: Color(0xFFBE185D),
    bgColor: Color(0xFFFFF1F2),
    borderColor: Color(0x339F1239),
    textColor: Color(0xFF881337),
    icon: Icons.favorite_outline,
    title: 'A memória vem no tempo certo...',
    message: 'Cada ano juntos merece sua própria história.',
  );
}

class _BodasPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFF9F1239).withValues(alpha: 0.03)..style = PaintingStyle.stroke..strokeWidth = 0.5;
    const s = 40.0;
    for (double x = 0; x < size.width; x += s) {
      for (double y = 0; y < size.height; y += s) {
        final path = Path()..moveTo(x, y - 4)..lineTo(x + 4, y)..lineTo(x, y + 4)..lineTo(x - 4, y)..close();
        canvas.drawPath(path, paint);
      }
    }
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _BodasSparkles extends StatefulWidget {
  const _BodasSparkles();
  @override
  State<_BodasSparkles> createState() => _BodasSparklesState();
}

class _BodasSparklesState extends State<_BodasSparkles> with SingleTickerProviderStateMixin {
  late AnimationController _c;
  @override
  void initState() { super.initState(); _c = AnimationController(vsync: this, duration: const Duration(seconds: 5))..repeat(reverse: true); }
  @override
  void dispose() { _c.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) {
    final rng = Random(71);
    return AnimatedBuilder(animation: _c, builder: (ctx, _) => Stack(
      children: List.generate(10, (i) {
        final p = 0.03 + (_c.value * 0.06 * (i % 3 == 0 ? 1 : 0.5));
        return Positioned(left: rng.nextDouble() * (MediaQuery.of(ctx).size.width - 10), top: rng.nextDouble() * (MediaQuery.of(ctx).size.height - 10),
          child: Opacity(opacity: p, child: Icon(i % 2 == 0 ? LucideIcons.sparkles : LucideIcons.wine, size: 8 + rng.nextDouble() * 6, color: const Color(0xFF9F1239))));
      }),
    ));
  }
}
