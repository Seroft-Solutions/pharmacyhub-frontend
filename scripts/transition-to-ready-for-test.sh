#!/bin/bash
# Script to transition JIRA issue to Ready for Test state
# Usage: ./transition-to-ready-for-test.sh PHAR-184

# Configuration
JIRA_URL="https://seroft-solutions.atlassian.net"
TRANSITION_ID="11"  # ID for Ready for Test transition

# Get the issue key from command line argument
ISSUE_KEY=$1

if [ -z "$ISSUE_KEY" ]; then
  echo "Error: Issue key required."
  echo "Usage: ./transition-to-ready-for-test.sh PHAR-184"
  exit 1
fi

# Transition the issue
echo "Transitioning $ISSUE_KEY to Ready for Test..."
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $JIRA_AUTH" \
  --data "{\"transition\": {\"id\": \"$TRANSITION_ID\"}}" \
  "$JIRA_URL/rest/api/2/issue/$ISSUE_KEY/transitions"

echo "Done. Please verify in JIRA that the issue was transitioned correctly."
