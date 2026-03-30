set ns [new Simulator] 

set tf [open out.tr w] 
$ns trace-all $tf 
set nf [open out.nam w] 
$ns namtrace-all $nf 

set n0 [$ns node] 
set n1 [$ns node] 
set n2 [$ns node] 
set n3 [$ns node] 

$ns duplex-link $n0 $n1 1Mb 10ms DropTail 
$ns duplex-link $n1 $n2 1Mb 10ms DropTail 
$ns duplex-link $n2 $n3 1Mb 10ms DropTail 
$ns duplex-link $n3 $n0 1Mb 10ms DropTail 

set udp [new Agent/UDP] 
$ns attach-agent $n0 $udp 

set null [new Agent/Null] 
$ns attach-agent $n2 $null

$ns connect $udp $null 

set cbr [new Application/Traffic/CBR] 
$cbr attach-agent $udp 
$cbr set packetSize_ 512 
$cbr set interval_ 0.1 

$ns at 1.0 "$cbr start" 
$ns at 4.0 "$cbr stop"

proc finish {} { 
global ns tf nf 
$ns flush-trace 
close $tf 
close $nf 
exec nam out.nam & 
exit 0 
} 
$ns at 5.0 "finish" 

$ns run