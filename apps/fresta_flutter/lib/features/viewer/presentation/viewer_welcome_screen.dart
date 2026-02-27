import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class ViewerWelcomeScreen extends StatefulWidget {
  const ViewerWelcomeScreen({super.key});

  @override
  State<ViewerWelcomeScreen> createState() => _ViewerWelcomeScreenState();
}

class _ViewerWelcomeScreenState extends State<ViewerWelcomeScreen> {
  final _controller = TextEditingController();
  String? _error;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _openLink() {
    final value = _controller.text.trim();
    if (value.isEmpty) {
      setState(() => _error = 'Cole um link ou ID de calendário.');
      return;
    }

    Uri? uri = Uri.tryParse(value);
    if (uri == null) {
      if (_looksLikeCalendarId(value)) {
        context.go('/c/$value');
        return;
      }
      setState(() => _error = 'Link inválido. Use https://.../c/<id> ou apenas o ID.');
      return;
    }

    String? id;
    if (uri.pathSegments.length >= 2 && uri.pathSegments.first == 'c') {
      id = uri.pathSegments[1];
    } else if (value.startsWith('/c/')) {
      id = value.substring(3);
    }

    // Support hash-based URLs (e.g. https://fresta.storyspark.com.br/#/c/{id})
    if (id == null && uri.fragment.isNotEmpty) {
      final fragment = uri.fragment;
      if (fragment.startsWith('/c/') && fragment.length > 3) {
        id = fragment.substring(3);
      } else if (fragment.startsWith('c/') && fragment.length > 2) {
        id = fragment.substring(2);
      }
    }

    if (id == null && _looksLikeCalendarId(value)) {
      id = value;
    }

    if (id != null && id.isNotEmpty && mounted) {
      setState(() => _error = null);
      context.go('/c/$id');
      return;
    }

    setState(() => _error = 'Não consegui encontrar o ID do calendário nesse link.');
  }

  bool _looksLikeCalendarId(String value) {
    final v = value.trim();
    if (v.isEmpty) return false;
    if (v.contains(' ')) return false;
    if (v.contains('/')) return false;
    return v.length >= 8;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          children: [
            // Custom App Bar
            Row(
              children: [
                Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () => context.go('/'),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x06000000),
                            blurRadius: 8,
                            offset: Offset(0, 2),
                          ),
                        ]
                      ),
                      child: const Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: Color(0xFF1B4D3E)),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                const Text(
                  'Modo Visualização',
                  style: TextStyle(
                    color: Color(0xFF1B4D3E),
                    fontWeight: FontWeight.w800,
                    fontSize: 20,
                    letterSpacing: -0.5,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 48),

            // Hero Graphic / Icon Placeholder
            Center(
              child: Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFFF7E6), Color(0xFFFDE6B5)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: const [
                    BoxShadow(color: Color(0x33F9A03F), blurRadius: 24, offset: Offset(0, 12)),
                    BoxShadow(color: Color(0x0A000000), blurRadius: 8, offset: Offset(0, 4)),
                  ]
                ),
                child: const Icon(
                  LucideIcons.gift,
                  size: 48,
                  color: Color(0xFFF9A03F),
                ),
              ),
            ),
            const SizedBox(height: 32),
            
            // Texts
            Text(
              'Abra um presente.',
              textAlign: TextAlign.center,
              style: theme.textTheme.headlineMedium?.copyWith(
                color: const Color(0xFF1B4D3E),
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Cole um link do Fresta ou apenas o ID.\nNão é necessário criar conta.',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: const Color(0xFF5A7470),
                fontWeight: FontWeight.w500,
                fontSize: 15,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 40),

            // Premium Input Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(28),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x0C000000),
                    blurRadius: 24,
                    offset: Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextField(
                    controller: _controller,
                    onSubmitted: (_) => _openLink(),
                    style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF1B4D3E)),
                    decoration: InputDecoration(
                      hintText: 'https://fresta.com/c/<id> ou <id>',
                      hintStyle: const TextStyle(color: Color(0xFF9CA3AF), fontWeight: FontWeight.normal),
                      labelText: 'Link ou ID do calendário',
                      labelStyle: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w500),
                      prefixIcon: const Icon(LucideIcons.link, color: Color(0xFF9CA3AF)),
                      filled: true,
                      fillColor: const Color(0xFFF8F9F5),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 1.5),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    ),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF2F2),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFFCA5A5)),
                      ),
                      child: Row(
                        children: [
                          const Icon(LucideIcons.circleAlert, size: 20, color: Color(0xFFDC2626)),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              _error!,
                              style: const TextStyle(
                                color: Color(0xFF991B1B),
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 24),
                  FilledButton.icon(
                    onPressed: _openLink,
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF1B4D3E),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    icon: const Icon(LucideIcons.externalLink, size: 20),
                    label: const Text(
                      'Abrir calendário',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 48),
            
            // Footnotes / Tips
            Padding(
               padding: const EdgeInsets.symmetric(horizontal: 16),
               child: Column(
                 crossAxisAlignment: CrossAxisAlignment.start,
                 children: [
                   const Text(
                     'DICAS RÁPIDAS',
                     style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF9CA3AF),
                        letterSpacing: 1.2,
                     ),
                   ),
                   const SizedBox(height: 16),
                   _TipRow(text: 'Os calendários podem ser vistos na web ou no app.'),
                   const SizedBox(height: 12),
                   _TipRow(text: 'Alguns criadores protegem o acesso com senha.'),
                   const SizedBox(height: 12),
                   _TipRow(text: 'Depois de ver, você pode criar o seu gratuitamente.'),
                 ],
               ),
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }
}

class _TipRow extends StatelessWidget {
  final String text;
  const _TipRow({required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(top: 2),
          child: Icon(LucideIcons.circleCheck, size: 16, color: Color(0xFF2D7A5F)),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              color: Color(0xFF5A7470),
              fontSize: 14,
              fontWeight: FontWeight.w500,
              height: 1.4,
            ),
          ),
        ),
      ],
    );
  }
}
