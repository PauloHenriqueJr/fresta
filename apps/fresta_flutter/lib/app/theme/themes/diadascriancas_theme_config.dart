import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

/// Dia das Crianças — Playful, colorful kids theme
class DiadascriancasThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'diadascriancas';

  @override
  Color get primaryColor => const Color(0xFF8B5CF6);

  @override
  Color get secondaryColor => const Color(0xFF06B6D4);

  @override
  Color get surfaceColor => const Color(0xFFF5F3FF);

  @override
  List<Color> get headerGradient => [const Color(0xFF8B5CF6), const Color(0xFF06B6D4)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF7C3AED);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF8B5CF6);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFF5F3FF);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.fredoka(fontWeight: FontWeight.w700);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _KidsElements();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white,
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: const Color(0xFF8B5CF6).withValues(alpha: 0.2)),
      boxShadow: [BoxShadow(color: const Color(0xFF8B5CF6).withValues(alpha: 0.08), blurRadius: 12, offset: const Offset(0, 4))],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return Stack(children: [
      Positioned.fill(child: Container(color: const Color(0xFFF5F3FF))),
      Positioned.fill(child: CustomPaint(painter: _KidsPatternPainter())),
      child,
    ]);
  }

  @override
  IconData get defaultIcon => LucideIcons.gamepad2;
  @override
  IconData get lockedIcon => LucideIcons.lock;
}

class _KidsPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final colors = [const Color(0xFF8B5CF6).withValues(alpha: 0.04), const Color(0xFF06B6D4).withValues(alpha: 0.04), const Color(0xFFF59E0B).withValues(alpha: 0.04)];
    const s = 45.0;
    int idx = 0;
    for (double x = 0; x < size.width; x += s) {
      for (double y = 0; y < size.height; y += s) {
        canvas.drawCircle(Offset(x, y), 4, Paint()..color = colors[idx % colors.length]);
        idx++;
      }
    }
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _KidsElements extends StatefulWidget {
  const _KidsElements();
  @override
  State<_KidsElements> createState() => _KidsElementsState();
}

class _KidsElementsState extends State<_KidsElements> with SingleTickerProviderStateMixin {
  late AnimationController _c;
  @override
  void initState() { super.initState(); _c = AnimationController(vsync: this, duration: const Duration(seconds: 3))..repeat(reverse: true); }
  @override
  void dispose() { _c.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) {
    final rng = Random(33);
    final icons = [LucideIcons.gamepad2, LucideIcons.star, LucideIcons.smile, LucideIcons.rocket];
    final colors = [const Color(0xFF8B5CF6), const Color(0xFF06B6D4), const Color(0xFFF59E0B), const Color(0xFFEC4899)];
    return AnimatedBuilder(animation: _c, builder: (ctx, _) => Stack(
      children: List.generate(14, (i) {
        final y = _c.value * 5 * (i % 2 == 0 ? 1 : -1);
        return Positioned(left: rng.nextDouble() * (MediaQuery.of(ctx).size.width - 14), top: rng.nextDouble() * (MediaQuery.of(ctx).size.height - 14),
          child: Opacity(opacity: 0.1, child: Transform.translate(offset: Offset(0, y),
            child: Icon(icons[i % icons.length], size: 8 + rng.nextDouble() * 8, color: colors[i % colors.length]))));
      }),
    ));
  }
}
