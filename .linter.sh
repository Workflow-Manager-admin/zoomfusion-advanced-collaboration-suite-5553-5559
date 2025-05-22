#!/bin/bash
cd /home/kavia/workspace/code-generation/zoomfusion-advanced-collaboration-suite-5553-5559/main_container_for_zoomfusion
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

