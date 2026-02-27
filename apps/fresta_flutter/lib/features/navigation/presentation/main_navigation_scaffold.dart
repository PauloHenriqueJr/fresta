import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class MainNavigationScaffold extends StatelessWidget {
  const MainNavigationScaffold({
    super.key,
    required this.navigationShell,
  });

  final StatefulNavigationShell navigationShell;

  void _onTap(BuildContext context, int index) {
    if (index == 2) {
      // "+ Criar" button acts as an action, not a tab index switch for the shell
      context.push('/creator/calendars/new');
      return;
    }

    // Adjust index because the center button is not a real tab in the shell
    int shellIndex = index;
    if (index > 2) {
      shellIndex = index - 1;
    }

    navigationShell.goBranch(
      shellIndex,
      initialLocation: shellIndex == navigationShell.currentIndex,
    );
  }

  int _calculateSelectedIndex() {
    int index = navigationShell.currentIndex;
    if (index >= 2) {
      return index + 1; // Offset due to the center button
    }
    return index;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final selectedIndex = _calculateSelectedIndex();

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: colorScheme.surface,
          boxShadow: [
            BoxShadow(
              color: colorScheme.tertiary.withValues(alpha: 0.05),
              blurRadius: 24,
              offset: const Offset(0, -8),
            ),
          ],
        ),
        // Wrap with SafeArea so it only expands bottom padding for iPhones/Androids with home indicators
        child: SafeArea(
          child: SizedBox(
            height: 64, // Explicit fixed height for the navbar content
            child: Row(
              children: [
                Expanded(
                  child: _NavBarItem(
                    icon: LucideIcons.house,
                    label: 'Início',
                    isSelected: selectedIndex == 0,
                    onTap: () => _onTap(context, 0),
                    colorScheme: colorScheme,
                  ),
                ),
                Expanded(
                  child: _NavBarItem(
                    icon: LucideIcons.calendar,
                    label: 'Calendários',
                    isSelected: selectedIndex == 1,
                    onTap: () => _onTap(context, 1),
                    colorScheme: colorScheme,
                  ),
                ),
                Expanded(
                  child: Center(
                    child: _CreateButton(
                      onTap: () => _onTap(context, 2),
                      colorScheme: colorScheme,
                    ),
                  ),
                ),
                Expanded(
                  child: _NavBarItem(
                    icon: LucideIcons.compass,
                    label: 'Explorar',
                    isSelected: selectedIndex == 3,
                    onTap: () => _onTap(context, 3),
                    colorScheme: colorScheme,
                  ),
                ),
                Expanded(
                  child: _NavBarItem(
                    icon: LucideIcons.user,
                    label: 'Perfil',
                    isSelected: selectedIndex == 4,
                    onTap: () => _onTap(context, 4),
                    colorScheme: colorScheme,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavBarItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;
  final ColorScheme colorScheme;

  const _NavBarItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
    required this.colorScheme,
  });

  @override
  Widget build(BuildContext context) {
    final color = isSelected ? colorScheme.primary : colorScheme.tertiary.withValues(alpha: 0.5);
    
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center, // Center icon and text
          mainAxisSize: MainAxisSize.min, // Keep tight inside the 64px height
          children: [
            Icon(icon, color: color, size: 22), // Slightly smaller icon
            const SizedBox(height: 4),
            Text(
              label,
              maxLines: 1, // DO NOT WRAP
              overflow: TextOverflow.visible,
              style: TextStyle(
                color: color,
                fontSize: 10,
                letterSpacing: -0.3,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CreateButton extends StatelessWidget {
  final VoidCallback onTap;
  final ColorScheme colorScheme;

  const _CreateButton({
    required this.onTap,
    required this.colorScheme,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 56,
        width: 56,
        decoration: BoxDecoration(
          color: colorScheme.secondary, // Muted Gold
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: colorScheme.secondary.withValues(alpha: 0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: const Icon(
          LucideIcons.plus,
          color: Colors.white,
          size: 28,
        ),
      ),
    );
  }
}
