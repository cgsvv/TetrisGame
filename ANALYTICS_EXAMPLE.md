# Google Analytics Event Tracking Example

[中文版 / Chinese Version](ANALYTICS_EXAMPLE_CN.md)

## How Google Analytics Tracks Your Game Events

### 1. **Event Flow Example**

When a player pauses the game:

```javascript
// 1. Player presses 'P' key
// 2. Game calls: pauseGame()
// 3. Reducer processes: 'PAUSE_GAME' action
// 4. Analytics tracking: safeTrackGameEvent.gamePause()
// 5. Google Analytics receives:
gtag('event', 'game_pause', {
  event_category: 'game',
  event_label: undefined,
  value: undefined
});
```

### 2. **What Gets Tracked**

#### Game Events:
- **Game Start**: When player starts a new game
- **Game Pause**: When player pauses the game
- **Game Resume**: When player resumes the game
- **Game Over**: When game ends (with score, level, lines)
- **Score Submit**: When player submits score to leaderboard

#### Settings Events:
- **AI Mode Toggle**: When player enables/disables AI
- **Speed Change**: When player adjusts game speed
- **Sound Toggle**: When player turns sound on/off
- **Language Change**: When player switches language

### 3. **Real Example Data**

#### Game Over Event:
```javascript
// When game ends with score 12500, level 5, 23 lines
gtag('event', 'game_over', {
  event_category: 'game',
  event_label: 'score_12500',
  value: 12500
});

gtag('event', 'level_reached', {
  event_category: 'game', 
  event_label: 'level_5',
  value: 5
});

gtag('event', 'lines_cleared', {
  event_category: 'game',
  event_label: 'lines_23', 
  value: 23
});
```

#### Score Submission:
```javascript
// When player submits score 12500
gtag('event', 'score_submit', {
  event_category: 'leaderboard',
  event_label: 'score_12500',
  value: 12500
});
```

### 4. **Where to See the Data**

#### In Google Analytics 4:

1. **Go to**: Reports → Engagement → Events
2. **Look for events like**:
   - `game_start` - How many games are started
   - `game_pause` - How often players pause
   - `game_over` - Game completion rate
   - `score_submit` - Leaderboard participation
   - `ai_mode_toggle` - AI feature usage
   - `sound_toggle` - Sound preference
   - `language_change` - Language preferences

#### Real-Time Reports:

1. **Go to**: Reports → Realtime → Events
2. **See events as they happen**:
   - Watch players start games
   - See when scores are submitted
   - Monitor feature usage

### 5. **Analytics Insights You Can Get**

#### Player Behavior:
- **Most popular features**: Which settings players use most
- **Game completion rate**: How many games reach game over
- **Session duration**: How long players stay engaged
- **Feature adoption**: How many use AI mode, sound, etc.

#### Performance Metrics:
- **Popular languages**: Which languages are most used
- **Speed preferences**: What game speeds players prefer
- **Sound usage**: Do players prefer sound on or off

#### Engagement Patterns:
- **Peak playing times**: When players are most active
- **Drop-off points**: Where players stop playing
- **Feature discovery**: How players find and use features

### 6. **Development vs Production**

#### Development Mode:
```javascript
// In development, events are logged to console
console.log('🎮 Game Event: Game Paused');
console.log('🎮 Game Event: Game Over', { score: 12500, level: 5, lines: 23 });
```

#### Production Mode:
```javascript
// In production, events are sent to Google Analytics
gtag('event', 'game_pause', { event_category: 'game' });
gtag('event', 'game_over', { 
  event_category: 'game', 
  event_label: 'score_12500', 
  value: 12500 
});
```

### 7. **Custom Reports You Can Create**

#### Game Performance Report:
- **Metric**: Event count for `game_over`
- **Dimension**: Event label (score ranges)
- **Insight**: Distribution of player scores

#### Feature Usage Report:
- **Metric**: Event count for `ai_mode_toggle`
- **Dimension**: Event label (enabled/disabled)
- **Insight**: AI feature adoption rate

#### User Engagement Report:
- **Metric**: Event count for `game_start`
- **Dimension**: Date
- **Insight**: Daily active players

### 8. **Privacy & GDPR Compliance**

#### What We Track:
- ✅ Game events (no personal data)
- ✅ Feature usage (anonymous)
- ✅ Performance metrics (aggregated)

#### What We Don't Track:
- ❌ Personal information
- ❌ Usernames or scores (only anonymous events)
- ❌ Individual player behavior patterns

### 9. **Setting Up Google Analytics**

1. **Create GA4 Property**:
   - Go to [Google Analytics](https://analytics.google.com)
   - Create new property
   - Get your tracking ID (G-XXXXXXXXXX)

2. **Update Environment Variables**:
   ```bash
   # .env.local
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX
   VITE_ANALYTICS_ENABLED=true
   ```

3. **Verify Tracking**:
   - Open browser dev tools
   - Check Network tab for gtag requests
   - Use GA4 DebugView for real-time testing

### 10. **Example Dashboard**

#### Key Metrics to Monitor:
- **Daily Active Players**: `game_start` events per day
- **Game Completion Rate**: `game_over` / `game_start`
- **Feature Adoption**: `ai_mode_toggle`, `sound_toggle`
- **Leaderboard Participation**: `score_submit` events
- **Language Distribution**: `language_change` events

This tracking system gives you comprehensive insights into how players interact with your Tetris game, helping you make data-driven decisions for improvements! 