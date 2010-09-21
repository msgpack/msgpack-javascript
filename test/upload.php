<?php
$data = fopen("php://input", "r");
$fp = fopen("last.bin", "w");

while ($part = fread($data, 8192)) { // 8192byte
    fwrite($fp, base64_decode($part));
}

fclose($fp);
fclose($data);

print_r(getallheaders());
?>
