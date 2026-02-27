import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class SaojoaoThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'saojoao';

  @override
  Color get primaryColor => const Color(0xFFE65100);

  @override
  Color get secondaryColor => const Color(0xFF5D4037);

  @override
  Color get surfaceColor => const Color(0xFFFFF8E8);

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
  String get defaultHeaderMessage => 'Eita que a festa tá boa demais, sô!';

  @override
  String get defaultFooterMessage => 'Viva São João! Muita alegria e forró no coração!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _SaoJoaoFlags();

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
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return _SaoJoaoBackground(child: child);
  }

  @override
  IconData get defaultIcon => LucideIcons.flame;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}

class _SaoJoaoBackground extends StatelessWidget {
  final Widget child;
  const _SaoJoaoBackground({required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: CustomPaint(painter: _WoodPatternPainter()),
        ),
        child,
      ],
    );
  }
}

class _WoodPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFD97706).withValues(alpha: 0.04)
      ..strokeWidth = 1;

    // Vertical stripes like wooden shingles
    const spacing = 10.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _SaoJoaoFlags extends StatefulWidget {
  const _SaoJoaoFlags();

  @override
  State<_SaoJoaoFlags> createState() => _SaoJoaoFlagsState();
}

class _SaoJoaoFlagsState extends State<_SaoJoaoFlags> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 3))..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = [const Color(0xFFE65100), const Color(0xFFFBBF24), const Color(0xFF4CAF50), const Color(0xFF2196F3), const Color(0xFFF44336)];
    final rng = Random(99);
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(12, (i) {
            final rotOff = _controller.value * 0.15 * (i % 2 == 0 ? 1 : -1);
            return Positioned(
              left: rng.nextDouble() * (MediaQuery.of(context).size.width - 16),
              top: rng.nextDouble() * (MediaQuery.of(context).size.height - 16),
              child: Opacity(
                opacity: 0.1,
                child: Transform.rotate(
                  angle: rotOff,
                  child: CustomPaint(
                    size: const Size(14, 18),
                    painter: _FlagPainter(colors[i % colors.length]),
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}

class _FlagPainter extends CustomPainter {
  final Color color;
  _FlagPainter(this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final path = Path()
      ..moveTo(size.width / 2, 0)
      ..lineTo(size.width, size.height * 0.7)
      ..lineTo(size.width / 2, size.height)
      ..lineTo(0, size.height * 0.7)
      ..close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
