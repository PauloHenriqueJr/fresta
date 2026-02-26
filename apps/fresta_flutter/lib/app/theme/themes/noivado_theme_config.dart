import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

/// Noivado (Engagement) — Rose gold / sparkly romantic theme
class NoivadoThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'noivado';

  @override
  Color get primaryColor => const Color(0xFFF472B6);

  @override
  Color get secondaryColor => const Color(0xFFE879F9);

  @override
  Color get surfaceColor => const Color(0xFFFDF2F8);

  @override
  List<Color> get headerGradient => [const Color(0xFFF472B6), const Color(0xFFE879F9)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFFBE185D);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFFF472B6);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFFDF2F8);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold, fontStyle: FontStyle.italic);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _NoivadoElements();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white,
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: const Color(0xFFF472B6).withValues(alpha: 0.2)),
      boxShadow: [BoxShadow(color: const Color(0xFFF472B6).withValues(alpha: 0.08), blurRadius: 12, offset: const Offset(0, 4))],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return Stack(children: [
      Positioned.fill(child: Container(color: const Color(0xFFFDF2F8))),
      Positioned.fill(child: CustomPaint(painter: _NoivadoPatternPainter())),
      child,
    ]);
  }

  @override
  IconData get defaultIcon => LucideIcons.sparkles;
  @override
  IconData get lockedIcon => LucideIcons.lock;
}

class _NoivadoPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFFF472B6).withValues(alpha: 0.03);
    const s = 50.0;
    for (double x = 0; x < size.width; x += s) {
      for (double y = 0; y < size.height; y += s) {
        canvas.drawCircle(Offset(x, y), 3, paint);
      }
    }
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _NoivadoElements extends StatefulWidget {
  const _NoivadoElements();
  @override
  State<_NoivadoElements> createState() => _NoivadoElementsState();
}

class _NoivadoElementsState extends State<_NoivadoElements> with SingleTickerProviderStateMixin {
  late AnimationController _c;
  @override
  void initState() { super.initState(); _c = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat(reverse: true); }
  @override
  void dispose() { _c.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) {
    final rng = Random(55);
    return AnimatedBuilder(animation: _c, builder: (ctx, _) => Stack(
      children: List.generate(12, (i) {
        final y = _c.value * 4 * (i % 2 == 0 ? 1 : -1);
        return Positioned(left: rng.nextDouble() * (MediaQuery.of(ctx).size.width - 14), top: rng.nextDouble() * (MediaQuery.of(ctx).size.height - 14),
          child: Opacity(opacity: 0.08, child: Transform.translate(offset: Offset(0, y),
            child: Icon(i % 3 == 0 ? LucideIcons.sparkles : Icons.favorite, size: 8 + rng.nextDouble() * 6, color: const Color(0xFFF472B6)))));
      }),
    ));
  }
}
