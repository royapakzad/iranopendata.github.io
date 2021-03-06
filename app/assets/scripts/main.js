import {h, render, Component} from 'preact';

import createHistory from 'history/createBrowserHistory';

const history = createHistory();

import Dataset from './components/Dataset';
import DatasetList from './components/DatasetList';
import FeaturedList from './components/FeaturedList';

function hamburgerClick (e) {
	e.preventDefault();
	var navClassList = document.querySelector('.nav-mobile').classList;
	if (!navClassList.contains('open')) {
		e.stopPropagation();
	  navClassList.add('open');
	}
}

function closePrimaryNav () {
  document.querySelector('.nav-mobile').classList.remove('open');
}

function scrollTo (e) {
	e.preventDefault();
	var resourceClassList = document.querySelector('.dropdown-resources-options').classList;
	if (!resourceClassList.contains('open')) {
		e.stopPropagation();
	  resourceClassList.add('open');
	}
}

function closeResourceList () {
  document.querySelector('.dropdown-resources-options').classList.remove('open');
}


function onReady () {
  const page_content = document.getElementById('page-content');
  const unlisten = history.listen((location, action) => {

    const datasetPath = /^\/([a-z0-9]{2})\/datasets\/([a-z0-9._-]+)$/;
    const matched = location.pathname.match(datasetPath);

    if (matched) {
      const language = matched[1];
      const dataset = matched[2];

      // We are rendering a single dataset
      page_content.innerHTML = '<section><div class="wrapper wrapper-content-sm wrapper-content-dataset" id="dynamic-single-dataset"></div></section>';

      // Modify the nav
      const navLinkEnglish = document.getElementById('nav-link-english');
      const navLinkFarsi = document.getElementById('nav-link-farsi');
      const path = location.pathname.slice(3);

      navLinkEnglish['href'] = `/en${path}`;
      navLinkFarsi['href'] = `/fa${path}`;

      // Render the dataset
      render(h(Dataset, {lang: language, id: dataset}), document.getElementById('dynamic-single-dataset'));
    }

    else {
      var errorText = "<p style='text-align: center; margin-bottom: 20em; font-size: 1em;'>Sorry, we can't seem to find the page you're looking for. Try going to the <a href='/"+PAGE_LANG+"'>homepage</a> or checkout some of our <a href='/"+PAGE_LANG+"/datasets'>datasets</a.</p>"
      page_content.innerHTML = '<h2 style="text-align: center; margin-top: 5em; margin-bottom: .4em;">404 - Page Not Found</h2>' + errorText;
    }

  });

  /////////////////////////////////////////////////////////////////////////
  // Adapted from 'Single Page Apps for GitHub Pages'
  // https://github.com/rafrex/spa-github-pages
  // Copyright (c) 2016 Rafael Pedicini, licensed under the MIT License
  // ----------------------------------------------------------------------
  // Uses createBrowserHistory instead of window.history
  /////////////////////////////////////////////////////////////////////////
  (function(l) {
    if (l.search) {
      var q = {};
      l.search.slice(1).split('&').forEach(function(v) {
        var a = v.split('=');
        q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
      });
      if (q.p !== undefined) {
        history.replace(
          l.pathname.slice(0, -1) + (q.p || '') +
            (q.q ? ('?' + q.q) : '') +
            l.hash
        );
      }
    }
  }(window.location));


  //-------------------//
  // BUTTONS
  //-------------------//
  var hamburger = document.querySelector('.menu-hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', hamburgerClick);
  }

  document.addEventListener('click', closePrimaryNav);

  var dropdown = document.querySelector('.dropdown-sm');
  if (dropdown) {
    dropdown.addEventListener('click', scrollTo);
    document.addEventListener('click', closeResourceList);
  }

  //-------------------//
  // RENDER REACT
  //-------------------//
  const content = document.getElementById('wrapper-content');
  if (content) {
    render(h(DatasetList), content);
  }

  const dataset = document.getElementById('wrapper-content-dataset');
  if (dataset) {
    render(h(Dataset, {lang: PAGE_LANG, id: DATASET_ID}), dataset);
  }

  const featuredList = document.getElementById('featured-homepage');
  if (featuredList) {
    render(h(FeaturedList), featuredList);
  }

  //---------------//
  // SCROLL HACK
  //---------------//
  window.scrollTo(0, 1);
  window.scrollTo(0, 0);
}


if (document.readyState != 'loading'){
  onReady();
} else {
  document.addEventListener('DOMContentLoaded', onReady);
}
