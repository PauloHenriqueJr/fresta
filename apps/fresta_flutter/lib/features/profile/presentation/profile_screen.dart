import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../auth/application/auth_controller.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final profile = auth.profile;
    final user = auth.user;
    final display = profile?.displayName ?? user?.email ?? 'Usuário';
    final initial = (display.isNotEmpty ? display.characters.first : 'U').toUpperCase();
    // Try multiple avatar sources
    final profileAvatar = profile?.avatar;
    final googleAvatar = user?.userMetadata?['avatar_url'] as String? ?? user?.userMetadata?['picture'] as String?;
    final avatarUrl = (profileAvatar != null && profileAvatar.startsWith('http')) ? profileAvatar : googleAvatar;
    final hasAvatar = avatarUrl != null && avatarUrl.startsWith('http');

    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        title: Text(
          'Perfil',
          style: theme.textTheme.titleLarge?.copyWith(
            color: colorScheme.onSurface,
            fontWeight: FontWeight.w900,
            letterSpacing: -1.0,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 100),
          children: [
            // User Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [colorScheme.tertiary, colorScheme.primary],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(32),
                boxShadow: [
                  BoxShadow(color: colorScheme.tertiary.withValues(alpha: 0.2), blurRadius: 24, offset: const Offset(0, 12)),
                ],
              ),
              child: Stack(
                children: [
                   Positioned(
                    top: -40,
                    right: -20,
                    child: Container(
                      width: 120,
                      height: 120,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [Color(0x20F9A03F), Colors.transparent],
                        ),
                      ),
                    ),
                  ),
                  Row(
                    children: [
                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          color: colorScheme.secondary,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white.withValues(alpha: 0.2), width: 4),
                          boxShadow: [
                            BoxShadow(
                              color: colorScheme.secondary.withValues(alpha: 0.3),
                              blurRadius: 16,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        clipBehavior: Clip.antiAlias,
                        alignment: Alignment.center,
                        child: hasAvatar
                            ? Image.network(
                                avatarUrl,
                                fit: BoxFit.cover,
                                width: 72,
                                height: 72,
                                errorBuilder: (_, __, ___) => Text(
                                  initial,
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 32),
                                ),
                              )
                            : Text(
                                initial,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 32,
                                ),
                              ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              display,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                                letterSpacing: -0.5,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              user?.email ?? profile?.email ?? 'Sem e-mail',
                              style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 14, fontWeight: FontWeight.w500),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            const Padding(
               padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
               child: Text(
                 'MENU PRINCIPAL',
                 style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF9CA3AF),
                    letterSpacing: 1.2,
                 ),
               ),
            ),

            Container(
              decoration: BoxDecoration(
                color: colorScheme.surface,
                borderRadius: BorderRadius.circular(32),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                children: [
                  _ProfileMenuItem(
                    icon: LucideIcons.settings,
                    iconColor: colorScheme.primary,
                    iconBgColor: colorScheme.primary.withValues(alpha: 0.1),
                    title: 'Configurações da conta',
                    subtitle: 'Preferências, plano e sessão',
                    onTap: () => context.push('/account/profile/settings'),
                  ),
                  Container(
                    height: 1,
                    color: colorScheme.onSurface.withValues(alpha: 0.05),
                    margin: const EdgeInsets.only(left: 76),
                  ),
                  _ProfileMenuItem(
                    icon: LucideIcons.bell,
                    iconColor: colorScheme.secondary,
                    iconBgColor: colorScheme.secondary.withValues(alpha: 0.1),
                    title: 'Notificações',
                    subtitle: 'Lembretes dos calendários',
                    onTap: () => context.push('/account/profile/notifications'),
                  ),
                  Container(
                    height: 1,
                    color: colorScheme.onSurface.withValues(alpha: 0.05),
                    margin: const EdgeInsets.only(left: 76),
                  ),
                  _ProfileMenuItem(
                    icon: LucideIcons.handHelping,
                    iconColor: colorScheme.primary,
                    iconBgColor: colorScheme.primary.withValues(alpha: 0.1),
                    title: 'Ajuda e Suporte',
                    subtitle: 'Fale com a equipe Fresta',
                    onTap: () => context.push('/account/profile/help'),
                  ),
                ],
              ),
            ),
            
             const SizedBox(height: 32),
             Center(
              child: Text(
                'Fresta v1.0.0',
                style: TextStyle(
                  color: const Color(0xFF9CA3AF),
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileMenuItem extends StatelessWidget {
  const _ProfileMenuItem({
    required this.icon,
    required this.iconColor,
    required this.iconBgColor,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final Color iconColor;
  final Color iconBgColor;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(28),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: iconBgColor,
                  borderRadius: BorderRadius.circular(16),
                ),
                alignment: Alignment.center,
                child: Icon(icon, color: iconColor, size: 24),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: colorScheme.onSurface, letterSpacing: -0.3),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6), fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
              Icon(LucideIcons.chevronRight, color: colorScheme.onSurface.withValues(alpha: 0.2)),
            ],
          ),
        ),
      ),
    );
  }
}
