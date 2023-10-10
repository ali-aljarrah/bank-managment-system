<?php

/**
 * Return string before needle if it exists.
 *
 * @param string $str
 * @param mixed $needle
 * @return string
 */
function str_before($str, $needle)
{
    $pos = strpos($str, $needle);

    return ($pos !== false) ? substr($str, 0, $pos) : $str;
}