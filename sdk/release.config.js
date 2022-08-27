module.exports = {
  // branches: ['release', { name: 'main', prerelease: 'rc' }],
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { type: 'chore', release: 'patch' },
          { type: 'refactor', release: 'patch' },
        ],
      },
    ],
    // "@semantic-release/changelog",
    "@semantic-release/npm",
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/github',
      {
        successComment: false,
        labels: false,
      },
    ],
    // ['@semantic-release/exec', { publishCmd: 'echo "::set-output name=release_version::${nextRelease.version}"' }],
  ],
  // https://github.com/semantic-release/commit-analyzer#release-rules
}
