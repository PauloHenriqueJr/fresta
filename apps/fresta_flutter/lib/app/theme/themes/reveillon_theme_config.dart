import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class ReveillonThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'reveillon';

  @override
  Color get primaryColor => const Color(0xFFFBBF24);

  @override
  Color get secondaryColor => const Color(0xFF0F172A);

  @override
  Color get surfaceColor => const Color(0xFF1E293B);

  @override
  List<Color> get headerGradient => [const Color(0xFFFBBF24), const Color(0xFFFDE68A)];

  @override
  Color titleColor(BuildContext context) => const Color(0xFFFBBF24);

  @override
  Color textColor(BuildContext context) => const Color(0xFF94A3B8);

  @override
  Color scaffoldBackgroundColor(BuildContext context) => const Color(0xFF0F172A);

  @override
  TextStyle get titleStyle => GoogleFonts.fredoka(fontWeight: FontWeight.w900);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500, color: const Color(0xFF94A3B8));

  @override
  String get defaultHeaderMessage => 'Um brinde ao novo ano que se inicia!';

  @override
  String get defaultFooterMessage => 'Que este ano seja repleto de luz e realizações!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _ReveillonStars();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    return BoxDecoration(
      color: const Color(0xFF1E293B).withValues(alpha: 0.9),
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFFFBBF24).withValues(alpha: 0.3)),
      boxShadow: [
        BoxShadow(color: const Color(0xFFFBBF24).withValues(alpha: 0.1), blurRadius: 12, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    return Stack(
      children: [
        Positioned.fill(
          child: Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment(0, -1),
                radius: 1.5,
                colors: [Color(0xFF1E3A8A), Color(0xFF0F172A), Color(0xFF020617)],
                stops: [0.0, 0.6, 1.0],
              ),
            ),
          ),
        ),
        Positioned.fill(
          child: CustomPaint(painter: _StarFieldPainter()),
        ),
        child,
      ],
    );
  }

  @override
  IconData get defaultIcon => LucideIcons.sparkles;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}

class _StarFieldPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final rng = Random(77);
    final paint = Paint()..color = const Color(0xFFFBBF24);
    for (int i = 0; i < 60; i++) {
      final x = rng.nextDouble() * size.width;
      final y = rng.nextDouble() * size.height;
      final radius = 0.5 + rng.nextDouble() * 1.2;
      paint.color = const Color(0xFFFBBF24).withValues(alpha: 0.05 + rng.nextDouble() * 0.1);
      canvas.drawCircle(Offset(x, y), radius, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _ReveillonStars extends StatefulWidget {
  const _ReveillonStars();

  @override
  State<_ReveillonStars> createState() => _ReveillonStarsState();
}

class _ReveillonStarsState extends State<_ReveillonStars> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 5))..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final rng = Random(42);
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(15, (i) {
            final pulse = 0.05 + (_controller.value * 0.1 * (i % 3 == 0 ? 1 : 0.5));
            return Positioned(
              left: rng.nextDouble() * (MediaQuery.of(context).size.width - 10),
              top: rng.nextDouble() * (MediaQuery.of(context).size.height - 10),
              child: Opacity(
                opacity: pulse,
                child: Icon(LucideIcons.sparkles, size: 8 + rng.nextDouble() * 6, color: const Color(0xFFFBBF24)),
              ),
            );
          }),
        );
      },
    );
  }
}
