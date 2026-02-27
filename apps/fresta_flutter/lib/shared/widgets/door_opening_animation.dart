import 'dart:math' as math;

import 'package:flutter/material.dart';

/// A full-screen overlay that plays a "door opening" animation
/// when a user taps a calendar day for the first time.
/// After the animation completes, [onComplete] is called.
class DoorOpeningAnimation extends StatefulWidget {
  const DoorOpeningAnimation({
    super.key,
    required this.dayNumber,
    required this.primaryColor,
    required this.secondaryColor,
    required this.onComplete,
    this.icon,
  });

  final int dayNumber;
  final Color primaryColor;
  final Color secondaryColor;
  final VoidCallback onComplete;
  final IconData? icon;

  /// Shows the door opening animation as an overlay, then calls [onComplete].
  static Future<void> show(
    BuildContext context, {
    required int dayNumber,
    required Color primaryColor,
    required Color secondaryColor,
    required VoidCallback onComplete,
    IconData? icon,
  }) async {
    final overlayState = Overlay.of(context);
    late OverlayEntry entry;

    entry = OverlayEntry(
      builder: (ctx) => DoorOpeningAnimation(
        dayNumber: dayNumber,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        icon: icon,
        onComplete: () {
          entry.remove();
          onComplete();
        },
      ),
    );

    overlayState.insert(entry);
  }

  @override
  State<DoorOpeningAnimation> createState() => _DoorOpeningAnimationState();
}

class _DoorOpeningAnimationState extends State<DoorOpeningAnimation>
    with TickerProviderStateMixin {
  late final AnimationController _doorController;
  late final AnimationController _contentController;
  late final AnimationController _sparkleController;

  late final Animation<double> _doorRotation;
  late final Animation<double> _contentScale;
  late final Animation<double> _contentOpacity;
  late final Animation<double> _backgroundOpacity;

  @override
  void initState() {
    super.initState();

    // Door swing open
    _doorController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    // Content reveal
    _contentController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    // Sparkle particles
    _sparkleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _doorRotation = Tween<double>(begin: 0, end: -math.pi / 2.5).animate(
      CurvedAnimation(parent: _doorController, curve: Curves.easeOutBack),
    );

    _contentScale = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(parent: _contentController, curve: Curves.elasticOut),
    );

    _contentOpacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _contentController, curve: Curves.easeIn),
    );

    _backgroundOpacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _doorController,
        curve: const Interval(0, 0.5, curve: Curves.easeIn),
      ),
    );

    _startAnimation();
  }

  Future<void> _startAnimation() async {
    // Fade in backdrop
    await Future.delayed(const Duration(milliseconds: 100));

    // Door swings open
    _doorController.forward();
    _sparkleController.forward();

    await Future.delayed(const Duration(milliseconds: 500));

    // Content reveals
    _contentController.forward();

    // Wait for content animation to finish, then auto-dismiss
    await Future.delayed(const Duration(milliseconds: 1200));

    widget.onComplete();
  }

  @override
  void dispose() {
    _doorController.dispose();
    _contentController.dispose();
    _sparkleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Material(
      color: Colors.transparent,
      child: AnimatedBuilder(
        animation: Listenable.merge([_doorController, _contentController, _sparkleController]),
        builder: (context, _) {
          return Stack(
            children: [
              // Dark backdrop
              Positioned.fill(
                child: GestureDetector(
                  onTap: widget.onComplete,
                  child: Container(
                    color: Colors.black.withValues(alpha: _backgroundOpacity.value * 0.7),
                  ),
                ),
              ),

              // Sparkle particles
              ..._buildSparkles(size),

              // Door + content center
              Center(
                child: SizedBox(
                  width: size.width * 0.55,
                  height: size.width * 0.7,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Glow behind the door
                      Transform.scale(
                        scale: _contentScale.value,
                        child: Container(
                          width: size.width * 0.5,
                          height: size.width * 0.6,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(24),
                            boxShadow: [
                              BoxShadow(
                                color: widget.primaryColor.withValues(alpha: _contentOpacity.value * 0.5),
                                blurRadius: 60,
                                spreadRadius: 20,
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Revealed content (day number + icon)
                      Opacity(
                        opacity: _contentOpacity.value,
                        child: Transform.scale(
                          scale: _contentScale.value,
                          child: Container(
                            width: size.width * 0.45,
                            height: size.width * 0.55,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  widget.primaryColor,
                                  widget.secondaryColor,
                                ],
                              ),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  widget.icon ?? Icons.auto_awesome,
                                  size: 48,
                                  color: Colors.white.withValues(alpha: 0.9),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Dia ${widget.dayNumber}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 28,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: -1,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '✨ Surpresa! ✨',
                                  style: TextStyle(
                                    color: Colors.white.withValues(alpha: 0.8),
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                      // Door panel (swings open via perspective rotation)
                      Transform(
                        alignment: Alignment.centerLeft,
                        transform: Matrix4.identity()
                          ..setEntry(3, 2, 0.002) // perspective
                          ..rotateY(_doorRotation.value),
                        child: Container(
                          width: size.width * 0.45,
                          height: size.width * 0.55,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                widget.primaryColor.withValues(alpha: 0.95),
                                widget.secondaryColor.withValues(alpha: 0.95),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.3),
                              width: 2,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.3),
                                blurRadius: 20,
                                offset: const Offset(10, 5),
                              ),
                            ],
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              // Day number circle
                              Container(
                                width: 64,
                                height: 64,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.white.withValues(alpha: 0.2),
                                  border: Border.all(
                                    color: Colors.white.withValues(alpha: 0.4),
                                    width: 2,
                                  ),
                                ),
                                child: Center(
                                  child: Text(
                                    '${widget.dayNumber}',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              // Handle/knob
                              Container(
                                width: 12,
                                height: 12,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.white.withValues(alpha: 0.6),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.white.withValues(alpha: 0.3),
                                      blurRadius: 8,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  List<Widget> _buildSparkles(Size size) {
    final random = math.Random(42); // Fixed seed for consistent positions
    final progress = _sparkleController.value;

    return List.generate(12, (i) {
      final angle = (i / 12) * 2 * math.pi;
      final radius = 80.0 + random.nextDouble() * 60;
      final sparkleSize = 4.0 + random.nextDouble() * 8;
      final delay = random.nextDouble() * 0.3;

      final adjustedProgress = ((progress - delay) / (1 - delay)).clamp(0.0, 1.0);
      final sparkleOpacity = adjustedProgress < 0.5
          ? adjustedProgress * 2
          : (1 - adjustedProgress) * 2;

      return Positioned(
        left: size.width / 2 + math.cos(angle) * radius * adjustedProgress - sparkleSize / 2,
        top: size.height / 2 + math.sin(angle) * radius * adjustedProgress - sparkleSize / 2,
        child: Opacity(
          opacity: sparkleOpacity.clamp(0.0, 1.0),
          child: Container(
            width: sparkleSize,
            height: sparkleSize,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: i % 2 == 0
                  ? widget.primaryColor.withValues(alpha: 0.8)
                  : Colors.white.withValues(alpha: 0.9),
              boxShadow: [
                BoxShadow(
                  color: widget.primaryColor.withValues(alpha: 0.5),
                  blurRadius: sparkleSize * 2,
                ),
              ],
            ),
          ),
        ),
      );
    });
  }
}
