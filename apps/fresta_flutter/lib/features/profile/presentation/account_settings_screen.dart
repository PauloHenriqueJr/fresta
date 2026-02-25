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

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9F5),
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1B4D3E)),
            style: IconButton.styleFrom(
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
        title: Text(
          'Configurações',
          style: theme.textTheme.titleLarge?.copyWith(
            color: const Color(0xFF1B4D3E),
            fontWeight: FontWeight.w800,
            letterSpacing: -0.5,
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
                color: Colors.white,
                borderRadius: BorderRadius.circular(28),
                boxShadow: const [
                  BoxShadow(color: Color(0x06000000), blurRadius: 16, offset: Offset(0, 4)),
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
                            color: const Color(0xFFE8F5E0),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          alignment: Alignment.center,
                          child: const Icon(LucideIcons.bellRing, color: Color(0xFF2D7A5F), size: 24),
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Notificações Push',
                                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: Color(0xFF1B4D3E), letterSpacing: -0.3),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Lembretes diários de abertura',
                                style: TextStyle(color: Color(0xFF5A7470), fontSize: 14, fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        ),
                        Switch.adaptive(
                          value: notifications,
                          onChanged: (value) => setState(() => notifications = value),
                          activeThumbColor: const Color(0xFF2D7A5F),
                          activeTrackColor: const Color(0xFFE8F5E0),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    height: 1,
                    color: const Color(0xFFF3F4F6),
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
                                    ? const Color(0xFFFFF7E6)
                                    : const Color(0xFFF3F4F6),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              alignment: Alignment.center,
                              child: Icon(
                                LucideIcons.crown,
                                color: (auth.profile?.role == 'premium' || auth.profile?.role == 'admin')
                                    ? const Color(0xFFF9A03F)
                                    : const Color(0xFF9CA3AF),
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
                                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: Color(0xFF1B4D3E), letterSpacing: -0.3),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    auth.profile?.role == 'premium' || auth.profile?.role == 'admin'
                                      ? 'Recursos ilimitados ativos'
                                      : 'Desbloqueie todos os recursos',
                                    style: const TextStyle(color: Color(0xFF5A7470), fontSize: 14, fontWeight: FontWeight.w500),
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
                    child: Row(
                      children: [
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF3F4F6),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          alignment: Alignment.center,
                          child: const Icon(LucideIcons.palette, color: Color(0xFF4B5563), size: 24),
                        ),
                        const SizedBox(width: 20),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Tema do App',
                                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: Color(0xFF1B4D3E), letterSpacing: -0.3),
                              ),
                              SizedBox(height: 4),
                              Text(
                                'Atualmente igual ao sistema',
                                style: TextStyle(color: Color(0xFF5A7470), fontSize: 14, fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        ),
                        Container(
                           padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                           decoration: BoxDecoration(
                             color: const Color(0xFFF3F4F6),
                             borderRadius: BorderRadius.circular(999),
                           ),
                           child: Text(
                            (auth.profile?.themePreference ?? 'Sistema').toUpperCase(),
                            style: const TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF6B7280), fontSize: 10, letterSpacing: 0.5),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            const Padding(
               padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
               child: Text(
                 'SESSÃO AVANÇADA',
                 style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF9CA3AF),
                    letterSpacing: 1.2,
                 ),
               ),
            ),
            
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(28),
                boxShadow: const [
                  BoxShadow(color: Color(0x06000000), blurRadius: 16, offset: Offset(0, 4)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Sessão Ativa', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: Color(0xFF1B4D3E), letterSpacing: -0.5)),
                  const SizedBox(height: 8),
                  Text(
                    auth.user?.email ?? 'Sem e-mail',
                    style: const TextStyle(color: Color(0xFF5A7470), fontSize: 15, fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 24),
                  FilledButton.icon(
                    onPressed: () async {
                      await ref.read(authControllerProvider.notifier).signOut();
                    },
                    icon: const Icon(LucideIcons.logOut, size: 20),
                    label: const Text('Sair da conta', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFFFEF2F2),
                      foregroundColor: const Color(0xFFDC2626),
                      minimumSize: const Size.fromHeight(56),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: TextButton(
                      onPressed: () => _showDeleteConfirmation(context),
                      style: TextButton.styleFrom(
                        foregroundColor: const Color(0xFF9CA3AF),
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
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(32),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(topLeft: Radius.circular(32), topRight: Radius.circular(32)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: (role == 'premium' || role == 'admin') ? const Color(0xFFFFF7E6) : const Color(0xFFF3F4F6),
                shape: BoxShape.circle,
              ),
              child: Icon(
                LucideIcons.crown, 
                color: (role == 'premium' || role == 'admin') ? const Color(0xFFF9A03F) : const Color(0xFF9CA3AF), 
                size: 32
              ),
            ),
            const SizedBox(height: 24),
            Text(
              role == 'premium' ? 'Você é Plus ⭐' : role == 'admin' ? 'Administrador 👑' : 'Você está no Free',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: Color(0xFF1B4D3E), letterSpacing: -0.5),
            ),
            const SizedBox(height: 12),
            Text(
              role == 'premium' || role == 'admin'
                ? 'Aproveite todos os temas, fotos ilimitadas e proteção por senha em seus calendários.'
                : 'Faça o upgrade para o Plus e desbloqueie 365 dias, fotos ilimitadas e temas exclusivos.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xFF5A7470), fontSize: 16),
            ),
            const SizedBox(height: 32),
            if (role == 'free')
            FilledButton(
              onPressed: () => context.pop(),
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF1B4D3E),
                minimumSize: const Size.fromHeight(60),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
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
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Excluir Conta? ⚠️', style: TextStyle(fontWeight: FontWeight.w800)),
        content: const Text(
          'Esta ação não pode ser desfeita. Todos os seus calendários, dados e preferências serão removidos para sempre.',
          style: TextStyle(color: Color(0xFF5A7470)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('CANCELAR', style: TextStyle(color: Color(0xFF9CA3AF), fontWeight: FontWeight.bold)),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Solicitação recebida. Enviaremos um e-mail de confirmação.')),
              );
            },
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('EXCLUIR TUDO', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
