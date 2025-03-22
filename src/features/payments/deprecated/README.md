# Deprecated Payment Components

This folder contains deprecated components that were previously used for managing premium exam access and payments. They have been replaced by a simpler "pay once, access all" implementation that grants all users access to all premium exams.

## Why These Components Were Deprecated

The product requirements changed to implement a "pay once, access all" model where:

1. Users only need to pay once to access all premium content
2. All premium exam access checks are handled at the backend level
3. The UI no longer shows payment dialogs, premium badges, or locked content indicators

## New Implementation

The new implementation simplifies the user experience by:

1. Automatically granting access to all premium exams
2. Removing premium indicators from the UI
3. Eliminating payment modals and flows
4. Treating all exams as already purchased

## Components in This Folder

- `PaymentModal.tsx`: Previously used to collect payment method information
- Other premium-related components that are no longer needed

These components are kept for reference but should not be used in new code.
