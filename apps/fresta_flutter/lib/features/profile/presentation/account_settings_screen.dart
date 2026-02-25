import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../auth/application/auth_controller.dart';

class AccountSettingsScreen extends ConsumerStatefulWidget {
  const AccountSettingsScreen({super.key});

  @override
  ConsumerState<AccountSettingsScreen> createState() => _AccountSettingsScreenState();
}

class _AccountSettingsScreenState extends ConsumerState<AccountSettingsScreen> {
  bool notifications = true;

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: IconButton(
            onPressed: () => context.pop(),
            icon: Icon(Icons.arrow_back_ios_new_rounded, color: colorScheme.primary),
            style: IconButton.styleFrom(
              backgroundColor: colorScheme.surface,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
        title: Text(
          'Configurações',
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
                   Padding(
                    padding: const EdgeInsets.all(24),
                    child: Row(
                      children: [
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            color: colorScheme.primary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          alignment: Alignment.center,
                          child: Icon(LucideIcons.bellRing, color: colorScheme.primary, size: 24),
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Notificações Push',
                                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: colorScheme.onSurface, letterSpacing: -0.3),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Lembretes diários de abertura',
                                style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6), fontSize: 14, fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        ),
                        Switch.adaptive(
                          value: notifications,
                          onChanged: (value) => setState(() => notifications = value),
                          activeThumbColor: colorScheme.primary,
                          activeTrackColor: colorScheme.primary.withValues(alpha: 0.3),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    height: 1,
                    color: colorScheme.onSurface.withValues(alpha: 0.1),
                    margin: const EdgeInsets.only(left: 76),
                  ),
                  Padding(
                     padding: const EdgeInsets.all(24),
                     child: InkWell(
                        onTap: () {
                          // In the future, this could open a native paywall or subscription manager
                          _showPlanDetails(context, auth.profile?.role ?? 'free');
                        },
                        borderRadius: BorderRadius.circular(12),
                        child: Row(
                          children: [
                            Container(
                              width: 52,
                              height: 52,
                              decoration: BoxDecoration(
                                color: (auth.profile?.role == 'premium' || auth.profile?.role == 'admin')
                                    ? colorScheme.secondary.withValues(alpha: 0.1)
                                    : colorScheme.onSurface.withValues(alpha: 0.05),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              alignment: Alignment.center,
                              child: Icon(
                                LucideIcons.crown,
                                color: (auth.profile?.role == 'premium' || auth.profile?.role == 'admin')
                                    ? colorScheme.secondary
                                    : colorScheme.onSurface.withValues(alpha: 0.4),
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 20),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    auth.profile?.role == 'premium' 
                                      ? 'Plano Plus ⭐' 
                                      : auth.profile?.role == 'admin' 
                                        ? '👑 Administrador'
                                        : 'Fresta Free',
                                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: colorScheme.onSurface, letterSpacing: -0.3),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    auth.profile?.role == 'premium' || auth.profile?.role == 'admin'
                                      ? 'Recursos ilimitados ativos'
                                      : 'Desbloqueie todos os recursos',
                                    style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6), fontSize: 14, fontWeight: FontWeight.w500),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(LucideIcons.chevronRight, color: Color(0xFFD1D5DB)),
                          ],
                        ),
                     ),
                  ),
                  Container(
                    height: 1,
                    color: const Color(0xFFF3F4F6),
                    margin: const EdgeInsets.only(left: 76),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 52,
                              height: 52,
                              decoration: BoxDecoration(
                                color: colorScheme.primary.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              alignment: Alignment.center,
                              child: Icon(LucideIcons.palette, color: colorScheme.primary, size: 24),
                            ),
                            const SizedBox(width: 20),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Tema do App',
                                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: colorScheme.onSurface, letterSpacing: -0.3),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Personalize sua experiência visual',
                                    style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6), fontSize: 14, fontWeight: FontWeight.w500),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        SegmentedButton<String>(
                          segments: const [
                            ButtonSegment(value: 'light', label: Text('Claro'), icon: Icon(LucideIcons.sun, size: 16)),
                            ButtonSegment(value: 'dark', label: Text('Escuro'), icon: Icon(LucideIcons.moon, size: 16)),
                            ButtonSegment(value: 'sistema', label: Text('Sistema'), icon: Icon(LucideIcons.monitor, size: 16)),
                          ],
                          selected: {(auth.profile?.themePreference?.toLowerCase() ?? 'sistema')},
                          onSelectionChanged: (newSelection) {
                            ref.read(authControllerProvider.notifier).updateThemePreference(newSelection.first);
                          },
                          showSelectedIcon: false,
                          style: SegmentedButton.styleFrom(
                            backgroundColor: colorScheme.surface,
                            selectedBackgroundColor: colorScheme.primary,
                            selectedForegroundColor: colorScheme.onPrimary,
                            side: BorderSide(color: colorScheme.onSurface.withValues(alpha: 0.1)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            Padding(
               padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
               child: Text(
                 'SESSÃO AVANÇADA',
                 style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: colorScheme.onSurface.withValues(alpha: 0.4),
                    letterSpacing: 1.2,
                 ),
               ),
            ),
            
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: colorScheme.surface,
                borderRadius: BorderRadius.circular(32),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Sessão Ativa', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: colorScheme.onSurface, letterSpacing: -0.5)),
                  const SizedBox(height: 8),
                  Text(
                    auth.user?.email ?? 'Sem e-mail',
                    style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6), fontSize: 15, fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 24),
                  FilledButton.icon(
                    onPressed: () async {
                      await ref.read(authControllerProvider.notifier).signOut();
                    },
                    icon: const Icon(LucideIcons.logOut, size: 20),
                    label: const Text('Sair da conta', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    style: FilledButton.styleFrom(
                      backgroundColor: colorScheme.error.withValues(alpha: 0.1),
                      foregroundColor: colorScheme.error,
                      minimumSize: const Size.fromHeight(56),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: TextButton(
                      onPressed: () => _showDeleteConfirmation(context),
                      style: TextButton.styleFrom(
                        foregroundColor: colorScheme.onSurface.withValues(alpha: 0.3),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text('Excluir conta permanentemente', style: TextStyle(fontWeight: FontWeight.w600)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showPlanDetails(BuildContext context, String role) {
    final colorScheme = Theme.of(context).colorScheme;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: const BorderRadius.only(topLeft: Radius.circular(32), topRight: Radius.circular(32)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: (role == 'premium' || role == 'admin') ? colorScheme.secondary.withValues(alpha: 0.1) : colorScheme.onSurface.withValues(alpha: 0.05),
                shape: BoxShape.circle,
              ),
              child: Icon(
                LucideIcons.crown, 
                color: (role == 'premium' || role == 'admin') ? colorScheme.secondary : colorScheme.onSurface.withValues(alpha: 0.4), 
                size: 32
              ),
            ),
            const SizedBox(height: 24),
            Text(
              role == 'premium' ? 'Você é Plus ⭐' : role == 'admin' ? 'Administrador 👑' : 'Você está no Free',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: colorScheme.onSurface, letterSpacing: -1.0),
            ),
            const SizedBox(height: 12),
            Text(
              role == 'premium' || role == 'admin'
                ? 'Aproveite todos os temas, fotos ilimitadas e proteção por senha em seus calendários.'
                : 'Faça o upgrade para o Plus e desbloqueie 365 dias, fotos ilimitadas e temas exclusivos.',
              textAlign: TextAlign.center,
              style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6), fontSize: 16, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 32),
            if (role == 'free')
            FilledButton(
              onPressed: () => context.pop(),
              style: FilledButton.styleFrom(
                backgroundColor: colorScheme.primary,
                minimumSize: const Size.fromHeight(60),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              child: const Text('Ver Planos Plus', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            )
            else
            TextButton(
              onPressed: () => context.pop(),
              child: const Text('FECHAR', style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 1.2)),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _showDeleteConfirmation(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: colorScheme.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
        title: Text('Excluir Conta? ⚠️', style: TextStyle(fontWeight: FontWeight.w900, color: colorScheme.onSurface)),
        content: Text(
          'Esta ação não pode ser desfeita. Todos os seus calendários, dados e preferências serão removidos para sempre.',
          style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6), fontWeight: FontWeight.w500),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('CANCELAR', style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.4), fontWeight: FontWeight.bold)),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Solicitação recebida. Enviaremos um e-mail de confirmação.')),
              );
            },
            style: FilledButton.styleFrom(
              backgroundColor: colorScheme.error,
              foregroundColor: colorScheme.onError,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('EXCLUIR TUDO', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
