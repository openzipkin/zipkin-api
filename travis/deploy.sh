#!/usr/bin/env bash
#
# Copyright 2018-2019 The OpenZipkin Authors
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
# in compliance with the License. You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under the License
# is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
# or implied. See the License for the specific language governing permissions and limitations under
# the License.
#

set -e
set -x

CURRENT_BRANCH=$1
GH_PAGES_BRANCH="gh-pages"

# Keep track of where Travis put us.
# We are on a detached head, and we need to be able to go back to it.
BUILD_HEAD=$(git rev-parse HEAD)

# Fetch all the remote branches. Travis clones with `--depth`, which
# implies `--single-branch`, so we need to overwrite remote.origin.fetch to
# do that.
git config --replace-all remote.origin.fetch +refs/heads/*:refs/remotes/origin/*
git fetch
# optionally, we can also fetch the tags
git fetch --tags

git checkout -qf $GH_PAGES_BRANCH

# finally, go back to where we were at the beginning

git checkout $CURRENT_BRANCH zipkin-api.yaml
git add zipkin-api.yaml
git checkout $CURRENT_BRANCH zipkin2-api.yaml
git add zipkin2-api.yaml
git checkout $CURRENT_BRANCH zipkin.proto
git add zipkin.proto

FILES_TO_BE_COMMITED=$(git status -s)
if [ ! -z "$FILES_TO_BE_COMMITED" ]; then
    git commit -m "$2"

    echo "Pushing to $GH_PAGES_BRANCH"
    git push origin $GH_PAGES_BRANCH
fi

echo "Back to HEAD"
git checkout ${BUILD_HEAD}
