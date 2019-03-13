/* global localStorage */
'use strict'
import fetch from 'isomorphic-fetch'
import config from '../config'
import * as AuthService from '../utils/auth'
import { LOCAL_PROJECTS } from '../utils/constants'

export const REQUEST_PROJECTS = 'REQUEST_PROJECTS'
export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS'

export const REQUEST_ANNOTATIONS = 'REQUEST_ANNOTATIONS'
export const RECEIVE_ANNOTATIONS = 'RECEIVE_ANNOTATIONS'

export const REQUEST_LABELS = 'REQUEST_LABELS'
export const RECEIVE_LABELS = 'RECEIVE_LABELS'

export const UPDATE_MODAL = 'UPDATE_MODAL'

export const SET_GRID = 'SET_GRID'

export const SELECT_TASK = 'SELECT_TASK'

export const UPDATE_ANNOTATION = 'UPDATE_ANNOTATION'
export const VALIDATE_GRID = 'VALIDATE_GRID'
export const SET_DRAW_LABEL = 'SET_DRAW_LABEL'
export const APPEND_ANNOTATION = 'APPEND_ANNOTATION'

export const REQUEST_SAVE = 'REQUEST_SAVE'
export const RECEIVE_SAVE = 'RECEIVE_SAVE'

export const REQUEST_PROJECT = 'REQUEST_PROJECT'
export const RECEIVE_PROJECT = 'RECEIVE_PROJECT'

export const REQUEST_EXPORTS = 'REQUEST_EXPORTS'
export const RECEIVE_EXPORTS = 'RECEIVE_EXPORTS'

export const ADD_PROJECT = 'ADD_PROJECT'
export const DELETE_PROJECT = 'DELETE_PROJECT'
export const INVALIDATE_PROJECT = 'INVALIDATE_PROJECT'

const fetchOptions = {
  headers: {
    'Authorization': `Bearer ${AuthService.getToken()}`
  }
}

export function requestProjects () {
  return { type: REQUEST_PROJECTS }
}

export function receiveProjects (projects, error = null) {
  return { type: RECEIVE_PROJECTS, data: projects, error, receivedAt: Date.now() }
}

export function fetchProjects () {
  return async function (dispatch) {
    dispatch(requestProjects())
    const ids = localStorage.getItem(LOCAL_PROJECTS) || '' // comma-separated string
    const projectPromises = ids.split(',').filter(Boolean)
      .map(id => fetch(`${config.api}/projects/${id}`, fetchOptions).then(resp => resp.json()))
    const projects = await Promise.all(projectPromises)
    dispatch(receiveProjects(projects))
  }
}

export function addProject (id) {
  return async function (dispatch) {
    dispatch(requestProject())
    const project = await fetch(`${config.api}/projects/${id}`, fetchOptions).then(resp => resp.json())
    dispatch({ type: ADD_PROJECT, data: project })
  }
}

export function deleteProject (id) {
  return { type: DELETE_PROJECT, data: id }
}

export function invalidateProject () {
  return { type: INVALIDATE_PROJECT }
}

export function requestProject () {
  return { type: REQUEST_PROJECT }
}

export function receiveProject (project, error = null) {
  return { type: RECEIVE_PROJECT, data: project, error, receivedAt: Date.now() }
}

export function fetchProject (id) {
  return getAndDispatch(`${config.api}/projects/${id}`, requestProject, receiveProject)
}

export function requestAnnotations () {
  return { type: REQUEST_ANNOTATIONS }
}

export function receiveAnnotations (annotations, error = null) {
  return { type: RECEIVE_ANNOTATIONS, data: annotations, error, receivedAt: Date.now() }
}

export function fetchAnnotations (projectID, query = {}) {
  return getAndDispatch(`${config.api}/projects/${projectID}/annotations/`, requestAnnotations, receiveAnnotations)
}

export function requestLabels () {
  return { type: REQUEST_LABELS }
}

export function receiveLabels (labels, error = null) {
  return { type: RECEIVE_LABELS, data: labels, error, receivedAt: Date.now() }
}

export function fetchLabels (projectID, query = {}) {
  return getAndDispatch(`${config.api}/projects/${projectID}/labels/`, requestLabels, receiveLabels)
}

export function requestExports () {
  return { type: REQUEST_EXPORTS }
}

export function receiveExports (exports, error = null) {
  return { type: RECEIVE_EXPORTS, data: exports, error, receivedAt: Date.now() }
}

export function fetchExports (id) {
  return getAndDispatch(`${config.api}/exports?project=${id}`, requestExports, receiveExports)
}

export function updateModal (type) {
  return { type: UPDATE_MODAL, data: type }
}

export function setGrid (grid) {
  return { type: SET_GRID, data: grid }
}

export function selectTask (id) {
  return { type: SELECT_TASK, data: id }
}

export function updateAnnotation (feature) {
  return { type: UPDATE_ANNOTATION, data: feature }
}

export function validateGrid (id) {
  return { type: VALIDATE_GRID, data: id }
}

export function setDrawLabel (label) {
  return { type: SET_DRAW_LABEL, data: label }
}

export function appendAnnotation (feature) {
  return { type: APPEND_ANNOTATION, data: feature }
}

export function requestSave () {
  return { type: REQUEST_SAVE }
}

export function receiveSave () {
  return { type: RECEIVE_SAVE }
}

export function saveProject (project) {
  const saveOptions = {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  }
  return fetchDispatchFactory(config.CATALOG_API, saveOptions, requestSave, receiveSave)
}

// Fetcher function
function getAndDispatch (url, requestFn, receiveFn) {
  return fetchDispatchFactory(url, fetchOptions, requestFn, receiveFn)
}

function fetchDispatchFactory (url, options, requestFn, receiveFn) {
  return function (dispatch, getState) {
    dispatch(requestFn())

    fetchJSON(url, options)
      .then(json => dispatch(receiveFn(json)), err => dispatch(receiveFn(null, err)))
  }
}

export function fetchJSON (url, options) {
  return fetch(url, options)
    .then(response => response.json())
    .catch(err => {
      console.log('fetchJSON error', err)
      return Promise.reject({
        message: err.message
      })
    })
}
