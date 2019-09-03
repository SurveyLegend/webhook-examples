<?php

function getComamndLineArgument($name) {
	return getopt(null, [$name . ':'])[$name];
}
