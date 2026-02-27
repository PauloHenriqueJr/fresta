import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

/// Metas (Goals) — Dark indigo with amber/gold accents, motivational theme
class MetasThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'metas';

  @override
  Color get primaryColor => const Color(0xFFFBBF24);

  @override
  Color get secondaryColor => const Color(0xFF4F46E5);

  @override
  Color get surfaceColor => const Color(0xFF1E1B4B);

  @override
  List<Color> get headerGradient => [const Color(0xFFFBBF24), const Color(0xFFFDE68A)];

  @override
  Color titleColor(BuildContext context) => const Color(0xFFFBBF24);

  @override
  Color textColor(BuildContext context) => const Color(0xFFA5B4FC);

  @override
  Color scaffoldBackgroundColor(BuildContext context) => const Color(0xFF1E1B4B);

  @override
  TextStyle get titleStyle => GoogleFonts.outfit(fontWeight: FontWeight.w800);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Um passo de cada vez rumo aos seus sonhos!';

  @override
  String get defaultFooterMessage => 'A persistência é o caminho do êxito. Continue firme!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _MetasElements();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    return BoxDecoration(
      color: const Color(0xFF312E81).withValues(alpha: 0.9),
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFFFBBF24).withValues(alpha: 0.3)),
      boxShadow: [BoxShadow(color: const Color(0xFFFBBF24).withValues(alpha: 0.1), blurRadius: 12, offset: const Offset(0, 4))],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    return Stack(children: [
      Positioned.fill(child: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(center: Alignment(0, -0.5), radius: 1.5,
            colors: [Color(0xFF312E81), Color(0xFF1E1B4B), Color(0xFF0F0D2E)], stops: [0.0, 0.5, 1.0]),
        ),
      )),
      Positioned.fill(child: CustomPaint(painter: _MetasPatternPainter())),
      child,
    ]);
  }

  @override
  IconData get defaultIcon => LucideIcons.target;
  @override
  IconData get lockedIcon => LucideIcons.lock;
}

class _MetasPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFFFBBF24).withValues(alpha: 0.06)..strokeWidth = 1;
    const s = 40.0;
    for (double x = 0; x < size.width; x += s) {
      for (double y = 0; y < size.height; y += s) {
        canvas.drawLine(Offset(x - 3, y), Offset(x + 3, y), paint);
        canvas.drawLine(Offset(x, y - 3), Offset(x, y + 3), paint);
      }
    }
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _MetasElements extends StatefulWidget {
  const _MetasElements();
  @override
  State<_MetasElements> createState() => _MetasElementsState();
}

class _MetasElementsState extends State<_MetasElements> with SingleTickerProviderStateMixin {
  late AnimationController _c;
  @override
  void initState() { super.initState(); _c = AnimationController(vsync: this, duration: const Duration(seconds: 5))..repeat(reverse: true); }
  @override
  void dispose() { _c.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) {
    final rng = Random(99);
    final icons = [LucideIcons.target, LucideIcons.rocket, LucideIcons.star, LucideIcons.zap];
    return AnimatedBuilder(animation: _c, builder: (ctx, _) => Stack(
      children: List.generate(12, (i) {
        final pulse = 0.04 + (_c.value * 0.08 * (i % 3 == 0 ? 1 : 0.5));
        return Positioned(left: rng.nextDouble() * (MediaQuery.of(ctx).size.width - 10), top: rng.nextDouble() * (MediaQuery.of(ctx).size.height - 10),
          child: Opacity(opacity: pulse, child: Icon(icons[i % icons.length], size: 8 + rng.nextDouble() * 6, color: const Color(0xFFFBBF24))));
      }),
    ));
  }
}
