FLUTTER_DIR := apps/fresta_flutter

# ── Web ──────────────────────────────────────────────────────────────────────
web-dev:
	bun run dev

web-build:
	bun run build

web-test:
	bun run test

web-lint:
	bun run lint

# ── Flutter ───────────────────────────────────────────────────────────────────
flutter-get:
	cd $(FLUTTER_DIR) && flutter pub get

flutter-run:
	cd $(FLUTTER_DIR) && flutter run

flutter-run-android:
	cd $(FLUTTER_DIR) && flutter run -d android

flutter-run-ios:
	cd $(FLUTTER_DIR) && flutter run -d ios

flutter-build-apk:
	cd $(FLUTTER_DIR) && flutter build apk

flutter-build-ios:
	cd $(FLUTTER_DIR) && flutter build ios

flutter-test:
	cd $(FLUTTER_DIR) && flutter test

flutter-analyze:
	cd $(FLUTTER_DIR) && flutter analyze

flutter-clean:
	cd $(FLUTTER_DIR) && flutter clean && flutter pub get

# ── Deploy ────────────────────────────────────────────────────────────────────
deploy:
	./deploy.sh

deploy-vps:
	./deploy-vps.sh

.PHONY: web-dev web-build web-test web-lint \
        flutter-get flutter-run flutter-run-android flutter-run-ios \
        flutter-build-apk flutter-build-ios flutter-test flutter-analyze flutter-clean \
        deploy deploy-vps
