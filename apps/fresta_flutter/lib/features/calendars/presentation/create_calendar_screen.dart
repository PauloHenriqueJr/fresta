import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../../auth/application/auth_controller.dart';
import '../application/calendar_providers.dart';
import '../../../app/theme/dating_theme.dart';

class CreateCalendarScreen extends ConsumerStatefulWidget {
  const CreateCalendarScreen({
    super.key,
    this.initialThemeId,
    this.isPremium = false,
  });

  final String? initialThemeId;
  final bool isPremium;

  @override
  ConsumerState<CreateCalendarScreen> createState() => _CreateCalendarScreenState();
}

class _CreateCalendarScreenState extends ConsumerState<CreateCalendarScreen> {
  late final PageController _pageController;
  late int _currentStep;

  final _titleController = TextEditingController();
  late String _selectedThemeId;
  int _duration = 7; // Start with 7 (free)
  String _privacy = 'private';
  bool _saving = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _selectedThemeId = widget.initialThemeId ?? 'aniversario';
    _currentStep = widget.initialThemeId != null ? 1 : 0;
    _pageController = PageController(initialPage: _currentStep);
  }

  @override
  void dispose() {
    _pageController.dispose();
    _titleController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < 2) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      setState(() => _currentStep++);
    } else {
      _save();
    }
  }

  void _prevStep() {
    final int minStep = widget.initialThemeId != null ? 1 : 0;
    if (_currentStep > minStep) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      setState(() => _currentStep--);
    } else {
      context.pop();
    }
  }

  Future<void> _save() async {
    final user = ref.read(authControllerProvider).user;
    if (user == null) return;

    setState(() {
      _saving = true;
      _error = null;
    });

    try {
      final id = await ref.read(calendarsRepositoryProvider).createCalendar(
            ownerId: user.id,
            title: _titleController.text.trim().isEmpty
                ? 'Meu Calendário'
                : _titleController.text.trim(),
            themeId: _selectedThemeId,
            duration: _duration,
            privacy: _privacy,
            isPremium: widget.isPremium || _duration > 7,
          );
      ref.invalidate(myCalendarsProvider);
      if (!mounted) return;
      
      if (widget.isPremium || _duration > 7) {
        context.go('/creator/calendars/$id/paywall/$_selectedThemeId');
      } else {
        context.go('/creator/calendars/$id');
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final isPremiumRequired = _duration > 7;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: IconButton(
            onPressed: _prevStep,
            icon: Icon(Icons.arrow_back_ios_new_rounded, color: colorScheme.primary),
            style: IconButton.styleFrom(
              backgroundColor: colorScheme.surface,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
        title: Column(
          children: [
            Text(
              _currentStep == 0
                  ? 'Escolha o Tema'
                  : _currentStep == 1
                      ? 'Configurações'
                      : 'Resumo e Plano',
              style: TextStyle(
                color: colorScheme.onSurface,
                fontWeight: FontWeight.w900,
                fontSize: 18,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(3, (index) {
                return Container(
                  width: 24,
                  height: 4,
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  decoration: BoxDecoration(
                    color: index <= _currentStep
                        ? colorScheme.primary
                        : colorScheme.onSurface.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                );
              }),
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          _ThemeSelectionStep(
            selectedId: _selectedThemeId,
            onSelected: (id) => setState(() => _selectedThemeId = id),
          ),
          _ConfigStep(
            titleController: _titleController,
            duration: _duration,
            privacy: _privacy,
            onDurationChanged: (val) => setState(() => _duration = val),
            onPrivacyChanged: (val) => setState(() => _privacy = val),
          ),
          _ReviewStep(
            themeId: _selectedThemeId,
            title: _titleController.text,
            duration: _duration,
            isPremium: isPremiumRequired,
            saving: _saving,
            error: _error,
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: FilledButton(
            onPressed: _saving ? null : _nextStep,
            style: FilledButton.styleFrom(
              backgroundColor: colorScheme.primary,
              foregroundColor: colorScheme.onPrimary,
              padding: const EdgeInsets.symmetric(vertical: 20),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              elevation: 0,
            ),
            child: _saving
                ? SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(colorScheme.onPrimary),
                    ),
                  )
                : Text(
                    _currentStep < 2 ? 'Continuar' : 'Criar Calendário',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 0.5),
                  ),
          ),
        ),
      ),
    );
  }
}

class _ThemeSelectionStep extends StatelessWidget {
  const _ThemeSelectionStep({required this.selectedId, required this.onSelected});
  final String selectedId;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final List<Map<String, dynamic>> categories = [
      {
        'title': 'Românticos',
        'icon': '💕',
        'items': [
          ('namoro', 'Amor & Romance', 'assets/images/themes/mascot-namoro.jpg', false),
          ('casamento', 'Nossa União', 'assets/images/themes/mascot-casamento.jpg', true),
          ('bodas', 'Bodas', 'assets/images/themes/mascot-bodas.jpg', true),
          ('noivado', 'Eternamente Juntos', 'assets/images/themes/mascot-noivado.jpg', true),
        ],
      },
      {
        'title': 'Festivos',
        'icon': '🎉',
        'items': [
          ('carnaval', 'Carnaval', 'assets/images/themes/mascot-carnaval.jpg', true),
          ('saojoao', 'São João', 'assets/images/themes/mascot-saojoao.png', true),
          ('reveillon', 'Réveillon', 'assets/images/themes/mascot-reveillon.jpg', true),
        ],
      },
      {
        'title': 'Religiosos',
        'icon': '✨',
        'items': [
          ('natal', 'Natal', 'assets/images/themes/mascot-natal.jpg', true),
          ('pascoa', 'Páscoa', 'assets/images/themes/mascot-pascoa.jpg', true),
        ],
      },
      {
        'title': 'Comemorações',
        'icon': '🎂',
        'items': [
          ('aniversario', 'Aniversário', 'assets/images/themes/mascot-aniversario.jpg', false),
          ('diadascriancas', 'Dia das Crianças', 'assets/images/themes/mascot-diadascriancas.jpg', false),
        ],
      },
      {
        'title': 'Família',
        'icon': '👥',
        'items': [
          ('diadasmaes', 'Dia das Mães', 'assets/images/themes/mascot-diadasmaes.jpg', false),
          ('diadospais', 'Dia dos Pais', 'assets/images/themes/mascot-diadospais.jpg', false),
        ],
      },
      {
        'title': 'Outros',
        'icon': '🌟',
        'items': [
          ('viagem', 'Viagem', 'assets/images/themes/mascot-viagem.jpg', true),
          ('estudo', 'Estudos', 'assets/images/themes/mascot-estudo.jpg', false),
          ('independencia', 'Independência', 'assets/images/themes/mascot-independencia.jpg', true),
          ('metas', 'Metas', 'assets/images/themes/mascot-metas.jpg', false),
        ],
      },
    ];

    return ListView.separated(
      padding: const EdgeInsets.symmetric(vertical: 24),
      itemCount: categories.length,
      separatorBuilder: (context, index) => const SizedBox(height: 32),
      itemBuilder: (context, categoryIndex) {
        final category = categories[categoryIndex];
        final String title = category['title'];
        final String icon = category['icon'];
        final List<(String, String, String, bool)> items = category['items'] as List<(String, String, String, bool)>;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  Text(icon, style: const TextStyle(fontSize: 24)),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: isDark ? Colors.white : const Color(0xFF1B4D3E),
                      letterSpacing: -0.5,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 220,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                scrollDirection: Axis.horizontal,
                itemCount: items.length,
                separatorBuilder: (context, index) => const SizedBox(width: 16),
                itemBuilder: (context, itemIndex) {
                  final t = items[itemIndex];
                  final isSelected = selectedId == t.$1;
                  
                  return GestureDetector(
                    onTap: () => onSelected(t.$1),
                    child: SizedBox(
                      width: 160,
                      child: Container(
                        decoration: BoxDecoration(
                          color: colorScheme.surface,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected ? const Color(0xFFF9A03F) : Colors.transparent,
                            width: 3,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(isDark ? 0.3 : 0.05),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Stack(
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Expanded(
                                  child: ClipRRect(
                                    borderRadius: const BorderRadius.vertical(top: Radius.circular(17)),
                                    child: Image.asset(
                                      t.$3,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: colorScheme.surface,
                                    borderRadius: const BorderRadius.vertical(bottom: Radius.circular(17)),
                                  ),
                                  child: Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          t.$2,
                                          style: TextStyle(
                                            fontWeight: FontWeight.w800,
                                            fontSize: 14,
                                            color: colorScheme.onSurface,
                                            height: 1.1,
                                          ),
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      if (isSelected)
                                        Container(
                                          padding: const EdgeInsets.all(4),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFF9A03F),
                                            shape: BoxShape.circle,
                                          ),
                                          child: const Icon(Icons.check_rounded, color: Colors.white, size: 14),
                                        ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            if (t.$4)
                              Positioned(
                                top: 8,
                                right: 8,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF9A03F),
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.2),
                                        blurRadius: 4,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(Icons.workspace_premium_rounded, color: Colors.white, size: 12),
                                      const SizedBox(width: 4),
                                      const Text(
                                        'PLUS',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 10,
                                          fontWeight: FontWeight.w900,
                                          letterSpacing: 0.5,
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
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
}

class _ConfigStep extends StatelessWidget {
  const _ConfigStep({
    required this.titleController,
    required this.duration,
    required this.privacy,
    required this.onDurationChanged,
    required this.onPrivacyChanged,
  });

  final TextEditingController titleController;
  final int duration;
  final String privacy;
  final ValueChanged<int> onDurationChanged;
  final ValueChanged<String> onPrivacyChanged;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        Text(
          'Dê um nome e defina o tempo',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: colorScheme.onSurface,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Escolha por quanto tempo a surpresa vai durar. Lembre-se: Calendários gratuitos são limitados a 7 dias.',
          style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6), fontSize: 14, height: 1.5, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 32),
        _StyledTextField(
          controller: titleController,
          label: 'Título da Fresta',
          icon: Icons.edit_rounded,
          hint: 'Ex: 24 Dias com Você',
        ),
        const SizedBox(height: 24),
        Text(
          'Duração do Calendário',
          style: TextStyle(fontWeight: FontWeight.w900, color: colorScheme.onSurface, fontSize: 15, letterSpacing: -0.3),
        ),
        const SizedBox(height: 12),
        Row(
          children: [7, 12, 24, 30].map((d) {
            final isSelected = duration == d;
            final isPremium = d > 7;
            return Expanded(
              child: GestureDetector(
                onTap: () => onDurationChanged(d),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    color: isSelected ? colorScheme.primary : colorScheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected ? colorScheme.primary : colorScheme.onSurface.withValues(alpha: 0.1),
                    ),
                  ),
                  child: Column(
                    children: [
                      Text(
                        '$d',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: isSelected ? colorScheme.onPrimary : colorScheme.onSurface,
                        ),
                      ),
                      Text(
                        'dias',
                        style: TextStyle(
                          fontSize: 12,
                          color: isSelected ? colorScheme.onPrimary.withValues(alpha: 0.8) : colorScheme.onSurface.withValues(alpha: 0.5),
                        ),
                      ),
                      if (isPremium)
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Icon(
                            Icons.star_rounded,
                            size: 14,
                            color: isSelected ? colorScheme.onPrimary : const Color(0xFFF9A03F),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 24),
        Text(
          'Privacidade',
          style: TextStyle(fontWeight: FontWeight.w900, color: colorScheme.onSurface, fontSize: 15, letterSpacing: -0.3),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _PrivacyOption(
              label: 'Privado',
              icon: Icons.lock_outline_rounded,
              isSelected: privacy == 'private',
              onTap: () => onPrivacyChanged('private'),
            ),
            const SizedBox(width: 12),
            _PrivacyOption(
              label: 'Público',
              icon: Icons.public_rounded,
              isSelected: privacy == 'public',
              onTap: () => onPrivacyChanged('public'),
            ),
          ],
        ),
      ],
    );
  }
}

class _PrivacyOption extends StatelessWidget {
  const _PrivacyOption({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });
  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isSelected ? colorScheme.primary : colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? colorScheme.primary : colorScheme.onSurface.withValues(alpha: 0.1),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 18, color: isSelected ? colorScheme.onPrimary : colorScheme.primary),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  fontWeight: FontWeight.w900,
                  color: isSelected ? colorScheme.onPrimary : colorScheme.onSurface,
                  letterSpacing: -0.3,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ReviewStep extends StatelessWidget {
  const _ReviewStep({
    required this.themeId,
    required this.title,
    required this.duration,
    required this.isPremium,
    required this.saving,
    this.error,
  });

  final String themeId;
  final String title;
  final int duration;
  final bool isPremium;
  final bool saving;
  final String? error;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        Text(
          'Confira os detalhes',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: colorScheme.onSurface,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: colorScheme.surface,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10, offset: const Offset(0, 4)),
            ],
          ),
          child: Column(
            children: [
              _ReviewRow(label: 'Título', value: title.isEmpty ? 'Meu Calendário' : title),
              Divider(height: 32, color: colorScheme.onSurface.withValues(alpha: 0.05)),
              _ReviewRow(
                label: 'Tema', 
                value: themeId == 'namoro' ? 'Namoro ❤️' : themeId.toUpperCase(),
                valueColor: themeId == 'namoro' ? DatingTheme.loveRed : null,
              ),
              Divider(height: 32, color: colorScheme.onSurface.withValues(alpha: 0.05)),
              _ReviewRow(label: 'Duração', value: '$duration dias'),
              Divider(height: 32, color: colorScheme.onSurface.withValues(alpha: 0.05)),
              _ReviewRow(
                label: 'Plano',
                value: isPremium ? 'Plus' : 'Gratuito',
                valueColor: isPremium ? const Color(0xFFF9A03F) : (themeId == 'namoro' ? DatingTheme.loveRed : colorScheme.primary),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        if (isPremium)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colorScheme.secondary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: colorScheme.secondary.withValues(alpha: 0.2)),
            ),
            child: Row(
              children: [
                Icon(Icons.stars_rounded, color: colorScheme.secondary),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Este é um calendário Plus. Você poderá criá-lo agora e o pagamento será solicitado para ativá-lo.',
                    style: TextStyle(color: colorScheme.secondary, fontSize: 13, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
          ),
        if (error != null) ...[
          const SizedBox(height: 24),
          Text(error!, style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
        ],
      ],
    );
  }
}

class _ReviewRow extends StatelessWidget {
  const _ReviewRow({required this.label, required this.value, this.valueColor});
  final String label;
  final String value;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6), fontWeight: FontWeight.w700)),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? colorScheme.onSurface,
            fontWeight: FontWeight.w900,
            fontSize: 16,
            letterSpacing: -0.3,
          ),
        ),
      ],
    );
  }
}

class _StyledTextField extends StatelessWidget {
  const _StyledTextField({
    required this.controller,
    required this.label,
    required this.icon,
    this.hint,
  });

  final TextEditingController controller;
  final String label;
  final IconData icon;
  final String? hint;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    return TextField(
      controller: controller,
      style: TextStyle(color: colorScheme.onSurface, fontWeight: FontWeight.w800),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        labelStyle: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.4), fontWeight: FontWeight.w700),
        hintStyle: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.2), fontWeight: FontWeight.w600),
        prefixIcon: Icon(icon, color: colorScheme.primary),
        filled: true,
        fillColor: colorScheme.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: colorScheme.onSurface.withValues(alpha: 0.1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: colorScheme.primary, width: 2),
        ),
      ),
    );
  }
}
