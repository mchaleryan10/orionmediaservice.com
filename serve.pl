#!/usr/bin/perl
use strict;
use warnings;
use HTTP::Daemon;
use HTTP::Status;
use File::Spec;

my $port = $ENV{PORT} || 3000;
my $root = $ENV{SERVE_ROOT} || do {
    my $script = $0;
    $script =~ s|[/\\][^/\\]+$||;
    $script;
};

my $d = HTTP::Daemon->new(LocalPort => $port, ReuseAddr => 1, ReusePort => 0)
    or die "Cannot create server: $!";

my %mime = (
    html  => 'text/html; charset=utf-8',
    css   => 'text/css',
    js    => 'application/javascript',
    json  => 'application/json',
    png   => 'image/png',
    jpg   => 'image/jpeg',
    jpeg  => 'image/jpeg',
    gif   => 'image/gif',
    svg   => 'image/svg+xml',
    ico   => 'image/x-icon',
    woff  => 'font/woff',
    woff2 => 'font/woff2',
    txt   => 'text/plain',
    xml   => 'application/xml',
);

print "Server running at http://localhost:$port\n";
STDOUT->flush();

while (my $c = $d->accept()) {
    while (my $r = $c->get_request()) {
        my $path = $r->url->path();
        $path = '/index.html' if $path eq '/';
        $path =~ s|^/||;
        $path =~ s|\.\.||g;  # security: no path traversal

        my $file = File::Spec->catfile($root, split('/', $path));

        if (-f $file) {
            my ($ext) = $file =~ /\.([^.]+)$/;
            $ext = lc($ext // '');
            my $ct = $mime{$ext} // 'application/octet-stream';
            open my $fh, '<:raw', $file or do { $c->send_error(500); next; };
            local $/;
            my $body = <$fh>;
            close $fh;
            my $res = HTTP::Response->new(200);
            $res->header('Content-Type' => $ct);
            $res->header('Content-Length' => length($body));
            $res->content($body);
            $c->send_response($res);
        } else {
            $c->send_error(404, "Not found: $path");
        }
    }
    $c->close();
}
