<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faArrowUpRightFromSquare,
  faCode,
  faCalendar,
  faStar,
  faCodeFork,
  faCircleDot
} from '@fortawesome/free-solid-svg-icons'

const GITHUB_USER = 'racacax'

interface GithubRepo {
  name: string
  full_name: string
  description: string | null
  language: string | null
  html_url: string
  updated_at: string
  topics: string[]
  stargazers_count: number
  forks_count: number
  open_issues_count: number
}

interface RepoEntry {
  repo: string
  localDescription: string
}

const mainRepos: RepoEntry[] = [
  {
    repo: 'mmstatus_public',
    localDescription:
      'Backend — collects and processes matchmaking data in real time from the Trackmania API.'
  },
  {
    repo: 'mmstatusclient',
    localDescription:
      'Frontend — Vue app displaying matchmaking statistics, leaderboards and charts.'
  }
]

const otherRepos: RepoEntry[] = [
  {
    repo: 'openplanet_servers_list',
    localDescription: 'Lists available servers for TrackMania via an in-game Openplanet overlay.'
  },
  {
    repo: 'openplanet_better_texture_mod',
    localDescription: 'Enhances TrackMania textures through an Openplanet plugin.'
  }
]

const allRepos = [...mainRepos, ...otherRepos]
const repoData = ref<Record<string, GithubRepo>>({})

onMounted(async () => {
  const results = await Promise.allSettled(
    allRepos.map((e) =>
      fetch(`https://api.github.com/repos/${GITHUB_USER}/${e.repo}`).then(
        (r) => r.json() as Promise<GithubRepo>
      )
    )
  )
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      repoData.value[allRepos[i].repo] = result.value
    }
  })
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function repoUrl(repo: string) {
  return `https://github.com/${GITHUB_USER}/${repo}`
}
</script>

<template>
  <div class="row g-4 mt-1">
    <div class="col-12 col-lg-4">
      <div class="d-flex align-items-center gap-3 mb-3">
        <img
          :src="`https://github.com/${GITHUB_USER}.png`"
          :alt="GITHUB_USER"
          class="about-avatar"
        />
        <div>
          <div class="fw-bold fs-5">{{ GITHUB_USER }}</div>
          <div class="text-muted" style="font-size: 0.85rem">Fullstack Developer</div>
        </div>
      </div>

      <p class="mb-3">
        Matchmaking Stats is an unofficial statistics tracker for the Trackmania ranked game mode.
        It gathers all matches, allowing to compute various statistics about activity, performance,
        and more.
      </p>
      <p class="mb-3">
        I started this project early 2024 during Spring 2024 season. Statistics prior to this season
        are unavailable.
      </p>
      <p class="mb-3">
        Backend and Frontend stacks are publicly available. Feel free to contribute !
      </p>

      <div class="d-flex flex-column flex-lg-row gap-2">
        <a
          :href="`https://github.com/${GITHUB_USER}`"
          target="_blank"
          class="btn btn-sm btn-outline-secondary align-self-start"
        >
          <FontAwesomeIcon :icon="faGithub" /> View GitHub profile
        </a>
        <a
          href="https://ko-fi.com/racacax"
          target="_blank"
          class="btn btn-sm btn-outline-danger align-self-start"
        >
          <img
            src="/icons/kofi.png"
            alt="Ko-fi"
            style="width: 16px; height: 16px; object-fit: contain"
          />
          Support on Ko-fi
        </a>
      </div>

      <hr class="my-4" />
      <div class="row">
        <div class="text-muted col-12 col-lg-6" style="font-size: 0.85rem">
          <div class="mb-1 fw-semibold text-body">Frontend Tech stack</div>
          <ul class="mb-0 ps-3">
            <li>Vue 3 + TypeScript + Vite</li>
            <li>Bootstrap 5 + SCSS</li>
            <li>Highcharts 11</li>
          </ul>
        </div>
        <div class="text-muted col-12 col-lg-6" style="font-size: 0.85rem">
          <div class="mb-1 fw-semibold text-body">Backend Tech stack</div>
          <ul class="mb-0 ps-3">
            <li>Python 3 + Peewee + MySQL</li>
            <li>Trackmania public API</li>
            <li>Trackmania in-game API</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-8">
      <h5 class="mb-3">This project</h5>
      <div class="row g-3 mb-4">
        <div v-for="entry in mainRepos" :key="entry.repo" class="col-12 col-md-6">
          <a :href="repoUrl(entry.repo)" target="_blank" class="about-repo-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <span class="fw-semibold">{{ repoData[entry.repo]?.name ?? entry.repo }}</span>
              <FontAwesomeIcon
                :icon="faArrowUpRightFromSquare"
                class="text-muted"
                style="font-size: 0.75rem; flex-shrink: 0; margin-top: 4px"
              />
            </div>
            <p class="text-muted mb-1" style="font-size: 0.83rem">{{ entry.localDescription }}</p>
            <p
              v-if="repoData[entry.repo]?.description"
              class="text-muted mb-2"
              style="font-size: 0.78rem; font-style: italic"
            >
              "{{ repoData[entry.repo].description }}"
            </p>
            <div v-if="repoData[entry.repo]?.topics?.length" class="d-flex flex-wrap gap-1 mb-2">
              <span
                v-for="topic in repoData[entry.repo].topics"
                :key="topic"
                class="badge about-topic-badge"
                >{{ topic }}</span
              >
            </div>
            <div
              class="d-flex flex-wrap gap-3 mt-auto"
              style="font-size: 0.78rem; color: var(--bs-secondary-color)"
            >
              <span v-if="repoData[entry.repo]?.language">
                <FontAwesomeIcon :icon="faCode" /> {{ repoData[entry.repo].language }}
              </span>
              <span v-if="repoData[entry.repo]?.stargazers_count !== undefined">
                <FontAwesomeIcon :icon="faStar" /> {{ repoData[entry.repo].stargazers_count }}
              </span>
              <span v-if="repoData[entry.repo]?.forks_count !== undefined">
                <FontAwesomeIcon :icon="faCodeFork" /> {{ repoData[entry.repo].forks_count }}
              </span>
              <span v-if="repoData[entry.repo]?.open_issues_count !== undefined">
                <FontAwesomeIcon :icon="faCircleDot" />
                {{ repoData[entry.repo].open_issues_count }} issues
              </span>
              <span v-if="repoData[entry.repo]?.updated_at" class="ms-auto">
                <FontAwesomeIcon :icon="faCalendar" />
                {{ formatDate(repoData[entry.repo].updated_at) }}
              </span>
            </div>
          </a>
        </div>
      </div>

      <h5 class="mb-3">Other Trackmania related projects</h5>
      <div class="row g-3">
        <div v-for="entry in otherRepos" :key="entry.repo" class="col-12 col-md-6">
          <a :href="repoUrl(entry.repo)" target="_blank" class="about-repo-card h-100">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <span class="fw-semibold">{{ repoData[entry.repo]?.name ?? entry.repo }}</span>
              <FontAwesomeIcon
                :icon="faArrowUpRightFromSquare"
                class="text-muted"
                style="font-size: 0.75rem; flex-shrink: 0; margin-top: 4px"
              />
            </div>
            <p class="text-muted mb-1" style="font-size: 0.83rem">{{ entry.localDescription }}</p>
            <p
              v-if="repoData[entry.repo]?.description"
              class="text-muted mb-2"
              style="font-size: 0.78rem; font-style: italic"
            >
              "{{ repoData[entry.repo].description }}"
            </p>
            <div v-if="repoData[entry.repo]?.topics?.length" class="d-flex flex-wrap gap-1 mb-2">
              <span
                v-for="topic in repoData[entry.repo].topics"
                :key="topic"
                class="badge about-topic-badge"
                >{{ topic }}</span
              >
            </div>
            <div
              class="d-flex flex-wrap gap-3 mt-auto"
              style="font-size: 0.78rem; color: var(--bs-secondary-color)"
            >
              <span v-if="repoData[entry.repo]?.language">
                <FontAwesomeIcon :icon="faCode" /> {{ repoData[entry.repo].language }}
              </span>
              <span v-if="repoData[entry.repo]?.stargazers_count !== undefined">
                <FontAwesomeIcon :icon="faStar" /> {{ repoData[entry.repo].stargazers_count }}
              </span>
              <span v-if="repoData[entry.repo]?.forks_count !== undefined">
                <FontAwesomeIcon :icon="faCodeFork" /> {{ repoData[entry.repo].forks_count }}
              </span>
              <span v-if="repoData[entry.repo]?.open_issues_count !== undefined">
                <FontAwesomeIcon :icon="faCircleDot" />
                {{ repoData[entry.repo].open_issues_count }} issues
              </span>
              <span v-if="repoData[entry.repo]?.updated_at" class="ms-auto">
                <FontAwesomeIcon :icon="faCalendar" />
                {{ formatDate(repoData[entry.repo].updated_at) }}
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.about-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid var(--bs-border-color);
  flex-shrink: 0;
}
.about-repo-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
.about-repo-card:hover {
  border-color: var(--bs-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: inherit;
}
.about-topic-badge {
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary-text-emphasis);
  font-weight: 400;
  font-size: 0.72rem;
}
</style>
