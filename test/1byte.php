<?php
$fileName = "1byte.bin";

header('Content-Type: application/octet-stream');
//header('Content-Disposition: attachment; filename=dl.zip');
header('Content-Length: ' . filesize($fileName));
readfile($fileName);
?>
