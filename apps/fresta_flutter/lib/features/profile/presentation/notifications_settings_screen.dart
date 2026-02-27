import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/services/notification_service.dart';

class NotificationsSettingsScreen extends ConsumerStatefulWidget {
  const NotificationsSettingsScreen({super.key});

  @override
  ConsumerState<NotificationsSettingsScreen> createState() => _NotificationsSettingsScreenState();
}

class _NotificationsSettingsScreenState extends ConsumerState<NotificationsSettingsScreen> {
  bool _dailyReminders = true;
  bool _newSurprises = true;
  bool _marketing = false;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    final service = ref.read(notificationServiceProvider);
    final daily = await service.getDailyRemindersEnabled();
    final surprises = await service.getNewSurprisesEnabled();
    final marketing = await service.getMarketingEnabled();
    if (mounted) {
      setState(() {
        _dailyReminders = daily;
        _newSurprises = surprises;
        _marketing = marketing;
        _loading = false;
      });
    }
  }

  Future<void> _onDailyRemindersChanged(bool val) async {
    setState(() => _dailyReminders = val);
    final service = ref.read(notificationServiceProvider);
    await service.setDailyRemindersEnabled(val);
    if (!val) {
      await service.cancelAll();
    }
  }

  Future<void> _onNewSurprisesChanged(bool val) async {
    setState(() => _newSurprises = val);
    await ref.read(notificationServiceProvider).setNewSurprisesEnabled(val);
  }

  Future<void> _onMarketingChanged(bool val) async {
    setState(() => _marketing = val);
    await ref.read(notificationServiceProvider).setMarketingEnabled(val);
  }

  @override
  Widget build(BuildContext context) {
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
            onPressed: () => Navigator.of(context).pop(),
            icon: Icon(LucideIcons.chevronLeft, color: colorScheme.primary),
            style: IconButton.styleFrom(
              backgroundColor: colorScheme.surface,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
        title: Text(
          'Notificações',
          style: theme.textTheme.titleLarge?.copyWith(
            color: colorScheme.onSurface,
            fontWeight: FontWeight.w900,
            letterSpacing: -1.0,
          ),
        ),
        centerTitle: true,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
        padding: const EdgeInsets.all(24),
        children: [
          _buildToggleSection(
            context: context,
            title: 'Lembretes Diários',
            subtitle: 'Receba um aviso toda manhã para abrir seu calendário.',
            value: _dailyReminders,
            onChanged: _onDailyRemindersChanged,
            icon: LucideIcons.bellRing,
            iconColor: const Color(0xFFF9A03F),
          ),
          const SizedBox(height: 16),
          _buildToggleSection(
            context: context,
            title: 'Novas Surpresas',
            subtitle: 'Saiba quando um criador adicionar novo conteúdo.',
            value: _newSurprises,
            onChanged: _onNewSurprisesChanged,
            icon: LucideIcons.sparkles,
            iconColor: const Color(0xFF2D7A5F),
          ),
          const SizedBox(height: 16),
          _buildToggleSection(
            context: context,
            title: 'Novidades e Dicas',
            subtitle: 'Dicas de presentes e atualizações do Fresta.',
            value: _marketing,
            onChanged: _onMarketingChanged,
            icon: LucideIcons.megaphone,
            iconColor: colorScheme.primary,
          ),
          const SizedBox(height: 40),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'As notificações ajudam você a não perder nenhum dia de surpresa. Você pode alterar essas configurações a qualquer momento.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: colorScheme.onSurface.withValues(alpha: 0.5),
                fontSize: 13,
                height: 1.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToggleSection({
    required BuildContext context,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
    required IconData icon,
    required Color iconColor,
  }) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                    color: colorScheme.onSurface,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: colorScheme.onSurface.withValues(alpha: 0.6),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            onChanged: onChanged,
            activeTrackColor: colorScheme.primary.withValues(alpha: 0.3),
            activeThumbColor: colorScheme.primary,
          ),
        ],
      ),
    );
  }
}
